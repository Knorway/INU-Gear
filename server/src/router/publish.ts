import express from 'express';

const router = express.Router();

router.post('/:sessionId', (req, res) => {
	const { pubsub } = req.app.context;
	const { sessionId } = req.params;

	pubsub.publish({ key: sessionId, payload: req.body });

	res.end();
});

export default {
	path: '/publish',
	router,
};
