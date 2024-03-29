import { manager, Prisma } from '@prisma/client';

import { serverContext } from '../context';

declare global {
	namespace Express {
		export interface Application {
			context: typeof serverContext;
		}
		export interface Request {
			user: manager;
		}
	}
}
