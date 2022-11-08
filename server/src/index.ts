import cors from 'cors';
import express from 'express';
import fs from 'fs';

import { PubSub } from './pubsub';

const pubsub = new PubSub();

const app = express();

app.use(cors());

app.get('/', async (req, res) => {
	const html = await fs.promises.readFile('index.html', { encoding: 'utf-8' });
	res.send(html);
});

app.get('/subscribe/:sessionId', (req, res) => {
	const { sessionId } = req.params;
	pubsub.subscribe({ key: sessionId, conn: res });
	console.log(Object.keys(pubsub.connections));
});

app.get('/publish/:sessionId', (req, res) => {
	const { sessionId } = req.params;
	const payload = JSON.stringify({ sessionId });
	pubsub.publish({ key: sessionId, payload });
	res.end();
});

const PORT = 8090;
app.listen(PORT, () => console.log(`server running on port: ${PORT}`));
