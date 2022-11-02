import _ from 'lodash';

export type Sequence<T extends keyof typeof SEQUENCES[number]> =
	typeof SEQUENCES[number][T];

export const DEFAULT_DELAY = 30;

export const SEQUENCES = [
	{ type: 'A', direction: 'UP', sequence: ['P', 'N', 'R', 'D'] },
	{ type: 'A', direction: 'UP', sequence: ['D', 'N', 'R', 'P'] },
	{ type: 'A', direction: 'LEFT', sequence: ['P', 'R', 'N', 'D'] },
	{ type: 'A', direction: 'LEFT', sequence: ['D', 'N', 'R', 'P'] },

	{ type: 'B', direction: 'UP', sequence: ['R', 'N', 'D'] },
	{ type: 'B', direction: 'UP', sequence: ['D', 'N', 'R'] },
	{ type: 'B', direction: 'LEFT', sequence: ['R', 'N', 'D'] },
	{ type: 'B', direction: 'LEFT', sequence: ['D', 'N', 'R'] },
] as const;
