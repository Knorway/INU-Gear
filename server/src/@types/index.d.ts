import { serverContext } from '../context';

declare global {
	namespace Express {
		export interface Application {
			context: typeof serverContext;
		}
	}
}
