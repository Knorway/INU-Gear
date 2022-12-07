import { serverContext } from '../';

declare global {
	namespace Express {
		export interface Application {
			context: typeof serverContext;
		}
	}
}
