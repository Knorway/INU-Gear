import { PrismaClient } from '@prisma/client';

import { PubSub } from './pubsub';

const prisma = new PrismaClient({ log: ['query'] });
const pubsub = new PubSub();

export const serverContext = {
	prisma,
	pubsub,
} as const;
