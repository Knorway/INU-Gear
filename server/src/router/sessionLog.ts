import { Prisma } from '@prisma/client';
import express from 'express';

import { asyncHandler } from '../asyncHandler';
import { SessionLogResult, SessionToken, TEMP_MANAGER_ID } from '../config';
import { prisma } from '../prisma';

const router = express.Router();

router.get(
	'/:uuid',
	asyncHandler(async (req, res) => {
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

router.post(
	// TODO: 이거 잘못 만듬. uuid가 토큰꺼임 body로 가야됨
	// 그리고 여기서 sessionToken patch 작업 대신하고 isFinished 조건도 체크해야하고
	// 내가 만약 하수라를 썼다면 이정도의 작업을 할 수 있었던 건가
	'/:uuid',
	asyncHandler(async (req, res) => {
		const token = await prisma.sessionToken.findFirst({
			where: { uuid: req.params.uuid },
		});

		const data = (req.body as Array<SessionLogResult>).map(
			(e) =>
				({
					sequence: e.sequence,
					starting: e.starting,
					destination: e.destination,
					type: e.type,
					direction: e.direction,
					distance: e.distance,
					travel: e.travel,
					initialReaction: e.logs.touch,
					responseTime: e.logs.diff,
					managerId: TEMP_MANAGER_ID,
					tokenId: token?.id!,
					createdAt: new Date(e.logs.pass),
				} as Prisma.sessionLogCreateManyInput)
		);

		await prisma.sessionLog.createMany({ data });

		res.end();
	})
);

router.delete(
	'/',
	asyncHandler(async (req, res) => {
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

		await prisma.$transaction([
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
		]);

		res.end();
	})
);

export default {
	route: '/session-log',
	router,
};
