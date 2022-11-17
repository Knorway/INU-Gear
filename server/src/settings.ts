export type SessionToken = {
	id: number;
	uuid: string;
	createdAt: Date;
	mangerId: number;
	sequence: typeof SEQUENCES;
	repetition: number;
};

export const SEQUENCES = [
	{ type: 'A', direction: 'UP', sequence: ['P', 'N', 'R', 'D'], repetition: 0 },
	{ type: 'A', direction: 'UP', sequence: ['D', 'N', 'R', 'P'], repetition: 0 },
	{ type: 'A', direction: 'LEFT', sequence: ['P', 'R', 'N', 'D'], repetition: 0 },
	{ type: 'A', direction: 'LEFT', sequence: ['D', 'N', 'R', 'P'], repetition: 0 },

	{ type: 'B', direction: 'UP', sequence: ['R', 'N', 'D'], repetition: 0 },
	{ type: 'B', direction: 'UP', sequence: ['D', 'N', 'R'], repetition: 0 },
	{ type: 'B', direction: 'LEFT', sequence: ['R', 'N', 'D'], repetition: 0 },
	{ type: 'B', direction: 'LEFT', sequence: ['D', 'N', 'R'], repetition: 0 },
] as const;
