import express from 'express';

import { pubsub } from '../pubsub';

const router = express.Router();

router.post('/:sessionId', (req, res) => {
	const { sessionId } = req.params;
	pubsub.publish({ key: sessionId, payload: req.body });
	res.end();
});

export default {
	route: '/publish',
	router: router,
};
