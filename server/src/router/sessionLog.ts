import { Prisma } from '@prisma/client';
import express from 'express';

import { asyncHandler } from '../asyncHandler';
import { SessionLogResult, SessionToken, TEMP_MANAGER_ID } from '../config';
import { jwtAuth } from '../middleware/authMiddleware';

const router = express.Router();

router.post(
	'/',
	jwtAuth,
	asyncHandler(async (req, res) => {
		const { prisma } = req.app.context;
		const { uuid, logs, sequence } = req.body;

		const token = await prisma.sessionToken.findFirst({
			where: { uuid },
		});

		const newSequence = (token?.sequence as Prisma.JsonArray).map((e) => {
			return (
				JSON.stringify(e) === JSON.stringify(sequence)
					? { ...sequence, repetition: 1 }
					: e
			) as SessionToken['sequence'][number];
		});

		const data = (logs as Array<SessionLogResult>).map(
			(e) =>
				({
					sequence: e.sequence,
					starting: e.starting,
					destination: e.destination,
					type: e.type,
					direction: e.direction,
					distance: e.distance,
					travel: e.travel,
					error: e.logs.error,
					initialReaction: e.logs.touch,
					responseTime: e.logs.diff,
					managerId: TEMP_MANAGER_ID,
					tokenId: token?.id!,
					createdAt: new Date(e.logs.pass),
				} as Prisma.sessionLogCreateManyInput)
		);

		const transactions = [
			prisma.sessionLog.createMany({ data }),
			prisma.sessionToken.updateMany({
				where: {
					uuid,
				},
				data: {
					...token,
					sequence: newSequence,
				},
			}),
		];

		const isFinished = newSequence.every((seq) => seq.repetition === 1);
		if (isFinished) {
			transactions.push(
				prisma.sessionToken.updateMany({
					where: {
						uuid,
					},
					data: {
						isFinished: true,
					},
				})
			);
		}

		await prisma.$transaction(transactions);

		res.end();
	})
);

router.delete(
	'/',
	jwtAuth,
	asyncHandler(async (req, res) => {
		const { prisma } = req.app.context;
		const { tokenId, uuids, sequence } = req.body;

		const token = await prisma.sessionToken.findFirst({
			where: {
				uuid: tokenId,
			},
		});

		const newSequence = (token?.sequence as Prisma.JsonArray).map((e) => {
			return (
				JSON.stringify(e) === JSON.stringify(sequence)
					? { ...sequence, repetition: 0 }
					: e
			) as SessionToken['sequence'][number];
		});

		const transactions = [
			prisma.sessionToken.updateMany({
				where: {
					uuid: tokenId,
				},
				data: {
					...token,
					sequence: newSequence,
				},
			}),
			prisma.sessionLog.deleteMany({
				where: {
					uuid: {
						in: uuids,
					},
				},
			}),
		];

		await prisma.$transaction(transactions);

		res.end();
	})
);

router.get(
	'/:uuid',
	asyncHandler(async (req, res) => {
		const { prisma } = req.app.context;

		const log = await prisma.sessionLog.findMany({
			where: {
				token: {
					uuid: req.params.uuid,
				},
			},
			orderBy: {
				createdAt: 'asc',
			},
		});

		res.json(log);
	})
);

export default {
	path: '/session-log',
	router,
};
