import express from 'express';
import jwt from 'jsonwebtoken';

import { asyncHandler } from '../asyncHandler';
import { jwtAuth } from '../middleware/authMiddleware';

const router = express.Router();

router.post(
	'/sign-in',
	asyncHandler(async (req, res) => {
		const { prisma } = req.app.context;

		const manager = await prisma.manager.findFirst({
			where: {
				account: req.body.account,
				password: req.body.password,
			},
		});

		if (!manager) {
			res.status(403);
			throw new Error('error signing in');
		}

		const token = jwt.sign({ uuid: manager.uuid }, process.env.JWT_SECRET!, {
			expiresIn: '365d',
			algorithm: 'HS256',
		});

		res.json(token);
	})
);

router.get(
	'/validate',
	jwtAuth,
	asyncHandler(async (req, res) => {
		const { password, ...user } = req.user;
		res.json(user);
	})
);

export default {
	path: '/auth',
	router,
};
