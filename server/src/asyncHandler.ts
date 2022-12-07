import { Handler } from 'express';

export const asyncHandler = (fn: Handler) => <Handler>(async (req, res, next) => {
		try {
			await Promise.resolve(fn(req, res, next));
		} catch (error) {
			next(error);
		}
	});
