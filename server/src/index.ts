import { PrismaClient } from '@prisma/client';
import cors from 'cors';
import express, { ErrorRequestHandler, Handler } from 'express';
import fs from 'fs';
import path from 'path';

import { PubSub } from './pubsub';
import { SEQUENCES, SessionToken } from './settings';

const prisma = new PrismaClient({ log: ['query'] });
const pubsub = new PubSub();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(path.resolve() + '/build'));

const asyncHandler = (fn: Handler) =>
	<Handler>((req, res, next) => Promise.resolve(fn(req, res, next)).then(next));

app.get('/', async (req, res) => {
	const html = await fs.promises.readFile(
		path.resolve() + '/build/index.html',
		'utf-8'
	);
	res.send(html);
});

app.get('/subscribe/:sessionId', (req, res) => {
	const { sessionId } = req.params;
	pubsub.subscribe({ key: sessionId, conn: res });
	console.log(Object.keys(pubsub.connections));
});

app.post('/publish/:sessionId', (req, res) => {
	const { sessionId } = req.params;
	pubsub.publish({ key: sessionId, payload: req.body });
	res.end();
});

app.get(
	'/session-token',
	asyncHandler(async (req, res) => {
		const tokens = await prisma.sessionToken.findMany();
		res.json(tokens);
	})
);

app.post('/session-token', async (req, res) => {
	const token = await prisma.sessionToken.create({
		data: {
			managerId: 3,
			sequence: SEQUENCES,
		},
	});

	res.json({ token });
});

app.get(
	'/session-token/:uuid',
	asyncHandler(async (req, res) => {
		const token = await prisma.sessionToken.findFirst({
			where: { uuid: req.params.uuid },
		});
		res.json(token);
	})
);

app.patch('/session-token/:uuid', async (req, res) => {
	const r = await prisma.sessionToken.updateMany({
		where: {
			uuid: req.params.uuid,
		},
		data: req.body as SessionToken,
	});
	res.json(r);
});

app.use(<ErrorRequestHandler>((error, req, res, next) => {
	res.status(500).json({ route: req.url, error: error.message, handled: true });
}));

// if (process.env.NODE_ENV === 'production') {
// 	//
// } else {
// 	app.get('*', async (req, res) => {
// 		const html = await fs.promises.readFile(
// 			path.resolve() + '/build/index.html',
// 			'utf-8'
// 		);
// 		res.send(html);
// 	});
// }

const PORT = process.env.PORT || 8090;
app.listen(PORT, () => console.log(`server running on http://localhost:${PORT}`));
