import express from 'express';

const router = express.Router();

router.get('/:sessionId', (req, res) => {
	const pubsub = req.app.context.pubsub;

	const { sessionId } = req.params;

	pubsub.subscribe({ key: sessionId, conn: res });
	console.log(
		`stream connected with ${JSON.stringify(
			Object.keys(pubsub.connections)
		)} as a key`
	);
});

export default {
	path: '/subscribe',
	router: router,
};
