import { Prisma, PrismaClient } from '@prisma/client';
import compression from 'compression';
import cors from 'cors';
import express, { ErrorRequestHandler, Handler } from 'express';
import fs from 'fs';
import path from 'path';

import { SEQUENCES, SessionLogResult, SessionToken } from './config';
import { PubSub } from './pubsub';

const PORT = process.env.PORT || 8090;
const TEMP_MANAGER_ID = 3;

const prisma = new PrismaClient({ log: ['query'] });
const pubsub = new PubSub();

const mainHtml = fs.readFileSync(path.resolve() + '/build/index.html', 'utf-8');
const amdinHtml = fs.readFileSync(path.resolve() + '/build/admin.html', 'utf-8');

const app = express();

app.use(cors());
// app.use(
// 	compression({
// 		filter: (req, res) => {
// 			if (req.url.includes('publish') || req.url.includes('subscribe'))
// 				return false;
// 			return compression.filter(req, res);
// 		},
// 	})
// );
app.use(express.json());
app.use(express.static(path.resolve() + '/build'));

const asyncHandler = (fn: Handler) => <Handler>(async (req, res, next) => {
		try {
			await Promise.resolve(fn(req, res, next));
		} catch (error) {
			next(error);
		}
	});

app.get('/subscribe/:sessionId', (req, res) => {
	const { sessionId } = req.params;
	pubsub.subscribe({ key: sessionId, conn: res });
	console.log(
		`stream connected with ${JSON.stringify(
			Object.keys(pubsub.connections)
		)} as a key`
	);
});

app.post(
	'/publish/:sessionId',
	asyncHandler(async (req, res) => {
		const { sessionId } = req.params;
		pubsub.publish({ key: sessionId, payload: req.body });
		res.end();
	})
);

app.get(
	'/session-token',
	asyncHandler(async (req, res) => {
		const pageQuery = Number(req.query.page) || 0;
		const perPage = 10;
		const skip = pageQuery * perPage;

		// TODO: 메인 페이지는 전부 다 가져오는 게 나을 수도 있다. 그러면 옵션 조정보다는 그냥 쿼리키/페처 따로두거나 다른 엔드포인트
		const tokens = await prisma.sessionToken.findMany({
			orderBy: { createdAt: 'asc' },
			skip,
			take: perPage + 1,
		});
		const totalCount = await prisma.sessionToken.count();
		console.log(totalCount);

		const payload = tokens.slice(0, 10);
		res.json({
			tokens: payload,
			hasNext: tokens.length === perPage + 1,
			count: payload.length,
			totalCount,
		});
	})
);

app.post(
	'/session-token',
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

app.delete(
	'/session-token',
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

app.get(
	'/session-token/:uuid',
	asyncHandler(async (req, res) => {
		const token = await prisma.sessionToken.findFirst({
			where: { uuid: req.params.uuid },
		});
		res.json(token);
	})
);

app.patch(
	'/session-token/:uuid',
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

app.get(
	'/session-log/:uuid',
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

app.post(
	'/session-log/:uuid',
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

app.get(
	'/aggregate/:sequence',
	asyncHandler(async (req, res) => {
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

// TODO: rewrites config and forEach
const rewrites = {};

app.get(['/admin', '/admin/*'], (req, res) => {
	res.send(amdinHtml);
});

app.get('*', (req, res) => {
	res.send(mainHtml);
});

app.use(<ErrorRequestHandler>((error, req, res, next) => {
	res.status(500).json({ route: req.url, error: error.message, handled: true });
	console.log(error.message); // TODO: send error message to db
}));

app.listen(PORT, () => console.log(`server running on http://localhost:${PORT}`));
