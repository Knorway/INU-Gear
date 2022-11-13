import { PrismaClient } from '@prisma/client';
import cors from 'cors';
import express, { ErrorRequestHandler, Handler } from 'express';

import { PubSub } from './pubsub';

const prisma = new PrismaClient({ log: ['query'] });
const pubsub = new PubSub();

const app = express();

app.use(cors());
app.use(express.json());

const asyncHandler = (fn: Handler) =>
	<Handler>((req, res, next) => Promise.resolve(fn(req, res, next)).then(next));

app.get('/subscribe/:sessionId', (req, res) => {
	const { sessionId } = req.params;
	pubsub.subscribe({ key: sessionId, conn: res });
	console.log(Object.keys(pubsub.connections));
});

app.post('/publish/:sessionId', (req, res) => {
	const { sessionId } = req.params;
	const { timeStamp } = req.body;
	const payload = { sessionId, timeStamp };
	pubsub.publish({ key: sessionId, payload });
	res.end();
});

app.get(
	'/session-token',
	asyncHandler(async (req, res) => {
		const tokens = await prisma.sessionToken.findMany();
		res.json(tokens);
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

app.use(<ErrorRequestHandler>((error, req, res, next) => {
	res.status(500).json({ route: req.url, error: error.message, handled: true });
}));

// if (process.env.NODE_ENV === 'production') {
// 	//
// } else {
// 	app.get('*', (req, res) => {
// 		console.log(req.url);
// 		res.send('pong');
// 	});
// }

const PORT = process.env.PORT || 8090;
app.listen(PORT, () => console.log(`server running on http://localhost:${PORT}`));
