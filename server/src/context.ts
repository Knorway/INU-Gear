import { PrismaClient } from '@prisma/client';

import { PubSub } from './pubsub';

const isProd = process.env.NODE_ENV === 'production';

const prisma = new PrismaClient({
	log: isProd ? ['error', 'warn'] : ['query', 'error', 'info', 'warn'],
});
const pubsub = new PubSub();

export const serverContext = {
	prisma,
	pubsub,
} as const;
