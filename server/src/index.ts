import { Prisma, PrismaClient } from '@prisma/client';
import cors from 'cors';
import express, { ErrorRequestHandler, Handler } from 'express';
import fs from 'fs';
import path from 'path';

import { PubSub } from './pubsub';
import { SEQUENCES, SessionLogResult, SessionToken } from './settings';

const prisma = new PrismaClient({ log: ['query'] });
const pubsub = new PubSub();

const html = fs.readFileSync(path.resolve() + '/build/index.html', 'utf-8');
const PORT = process.env.PORT || 8090;
const TEMP_MANAGER_ID = 3;

const app = express();

app.use(cors());
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
		const tokens = await prisma.sessionToken.findMany({
			orderBy: { createdAt: 'asc' },
		});
		res.json(tokens);
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
		const logs = await prisma.sessionLog.findMany({
			// pagination
		});
		res.json(logs);
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

app.use('*', (req, res) => {
	res.send(html);
});

app.use(<ErrorRequestHandler>((error, req, res, next) => {
	res.status(500).json({ route: req.url, error: error.message, handled: true });
	console.log(error.message); // TODO: send error message to db
}));

app.listen(PORT, () => console.log(`server running on http://localhost:${PORT}`));
