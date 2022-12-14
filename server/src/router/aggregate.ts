import express from 'express';

import { asyncHandler } from '../asyncHandler';

const router = express.Router();

router.get(
	'/test',
	asyncHandler(async (req, res) => {
		const { prisma } = req.app.context;

		// querystring: sequence, start/dest, dir, token,

		const r = await prisma.sessionLog.aggregate({
			where: {
				sequence: {
					equals: ['R', 'N', 'D'],
				},
				destination: 'P',
			},
			_avg: {
				responseTime: true,
			},
		});

		res.json(r);
	})
);

router.get(
	'/:sequence',
	asyncHandler(async (req, res) => {
		const { prisma } = req.app.context;

		const agg = await prisma.sessionLog.aggregate({
			where: {
				sequence: {
					equals: JSON.parse(req.params.sequence),
				},
			},
			_avg: {
				responseTime: true,
				initialReaction: true,
			},
			_min: {
				responseTime: true,
				initialReaction: true,
			},
			_max: {
				responseTime: true,
				initialReaction: true,
			},
		});

		res.json(agg);
	})
);

export default {
	path: '/aggregate',
	router,
};
