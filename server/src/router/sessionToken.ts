import { Prisma } from '@prisma/client';
import express from 'express';

import { asyncHandler } from '../asyncHandler';
import { SEQUENCES, TEMP_MANAGER_ID } from '../config';
import { jwtAuth } from '../middleware/authMiddleware';

const router = express.Router();

router.get(
	'/',
	asyncHandler(async (req, res) => {
		const { prisma } = req.app.context;

		const pageQuery = Number(req.query.page) || 0;
		const perPage = 10;
		const skip = pageQuery * perPage;
		const searchText = req.query.search as string;

		const excluded = ['main'].includes(req.query.context as string);

		const option: Prisma.sessionTokenFindManyArgs = excluded
			? {
					where: {
						isFinished: false,
					},
			  }
			: {
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

		const queries = [
			prisma.sessionToken.findMany({
				...option,
				orderBy: { createdAt: 'desc' },
			}),
			prisma.sessionToken.count({
				where: option.where,
			}),
		] as const;

		const [tokens, totalCount] = await Promise.all(queries);
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
	jwtAuth,
	asyncHandler(async (req, res) => {
		const { prisma } = req.app.context;
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
	jwtAuth,
	asyncHandler(async (req, res) => {
		const { prisma } = req.app.context;
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
		const { prisma } = req.app.context;

		const token = await prisma.sessionToken.findFirst({
			where: { uuid: req.params.uuid },
		});

		res.json(token);
	})
);

export default {
	path: '/session-token',
	router,
};
