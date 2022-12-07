import express from 'express';

import { pubsub } from '../pubsub';

const router = express.Router();

router.get('/:sessionId', (req, res) => {
	const { sessionId } = req.params;
	pubsub.subscribe({ key: sessionId, conn: res });
	console.log(
		`stream connected with ${JSON.stringify(
			Object.keys(pubsub.connections)
		)} as a key`
	);
});

export default {
	route: '/subscribe',
	router: router,
};
