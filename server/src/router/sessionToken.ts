import { Prisma } from '@prisma/client';
import express from 'express';

import { asyncHandler } from '../asyncHandler';
import { SEQUENCES, SessionToken, TEMP_MANAGER_ID } from '../config';
import { prisma } from '../prisma';

const router = express.Router();

router.get(
	'/',
	asyncHandler(async (req, res) => {
		const pageQuery = Number(req.query.page) || 0;
		const perPage = 10;
		const skip = pageQuery * perPage;
		const searchText = req.query.search as string;

		const excluded = ['main'].includes(req.query.context as string);

		const option: Prisma.sessionTokenFindManyArgs = excluded
			? { orderBy: { createdAt: 'asc' } }
			: {
					orderBy: { createdAt: 'asc' },
					skip,
					take: perPage + 1,
					where: {
						label: {
							...(Boolean(searchText) && {
								contains: searchText,
							}),
						},
					},
			  };

		const tokens = await prisma.sessionToken.findMany(option);
		const totalCount = await prisma.sessionToken.count({
			where: option.where,
		});

		const payload = excluded ? tokens : tokens.slice(0, 10);

		res.json({
			tokens: payload,
			hasNext: tokens.length === perPage + 1,
			count: payload.length,
			totalCount,
		});
	})
);

router.post(
	'/',
	asyncHandler(async (req, res) => {
		const { label } = req.body;
		const token = await prisma.sessionToken.create({
			data: {
				label,
				managerId: TEMP_MANAGER_ID,
				sequence: SEQUENCES,
			},
		});
		res.json(token);
	})
);

router.delete(
	'/',
	asyncHandler(async (req, res) => {
		const { tokens } = req.body;
		await prisma.sessionToken.deleteMany({
			where: {
				uuid: {
					in: tokens,
				},
			},
		});
		res.end();
	})
);

router.get(
	'/:uuid',
	asyncHandler(async (req, res) => {
		const token = await prisma.sessionToken.findFirst({
			where: { uuid: req.params.uuid },
		});
		res.json(token);
	})
);

router.patch(
	// TODO: 사실 이것도 log하위에서 업데이트 하는 게 맞다
	'/:uuid',
	asyncHandler(async (req, res) => {
		const token = await prisma.sessionToken.findFirst({
			where: { uuid: req.params.uuid },
		});

		const newSequence = (token?.sequence as Prisma.JsonArray).map((e) => {
			return (
				JSON.stringify(e) === JSON.stringify(req.body)
					? { ...req.body, repetition: 1 }
					: e
			) as SessionToken['sequence'][number];
		});

		await prisma.sessionToken.updateMany({
			where: {
				uuid: req.params.uuid,
			},
			data: {
				...token,
				sequence: newSequence,
			},
		});

		res.status(200).end();
	})
);

export default {
	route: '/session-token',
	router,
};
