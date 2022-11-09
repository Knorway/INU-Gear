import cors from 'cors';
import express from 'express';

import { PubSub } from './pubsub';

const pubsub = new PubSub();

const app = express();

app.use(cors());
app.use(express.json());

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

if (process.env.NODE_ENV === 'production') {
	//
} else {
	app.get('*', (req, res) => {
		res.send('pong');
	});
}

const PORT = process.env.PORT || 8090;
app.listen(PORT, () => console.log(`server running on http://localhost:${PORT}`));
