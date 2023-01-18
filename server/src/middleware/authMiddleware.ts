import { Handler } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';

export const jwtAuth = <Handler>(async (req, res, next) => {
	const { prisma } = req.app.context;

	if (!req.headers.authorization || !req.headers.authorization.startsWith('Bearer')) {
		res.status(403);
		next(new Error('no token'));
		return;
	}

	try {
		const token = req.headers.authorization.split('Bearer')[1].trim();
		const decoded = jwt.verify(token, process.env.JWT_SECRET!, {
			algorithms: ['HS256'],
		}) as JwtPayload;

		const user = await prisma.manager.findFirst({ where: { uuid: decoded.uuid } });

		if (!user) {
			res.status(403);
			next(new Error('authorization failed while decoding given token'));
			return;
		}

		req.user = user;
		next();
	} catch (error) {
		res.status(400);
		next(new Error('invalid request'));
		return;
	}
});
