export type Sequence<T extends keyof typeof SEQUENCES[number]> =
	typeof SEQUENCES[number][T];

export type SequenceChar = Sequence<'sequence'>[number];

export const DEFAULT_DELAY = 30;

export const TIMEOUT_UNIT = 1000;
export const TIMEOUT_RANGE = 10;
export const TIMEOUT_MIN = 1 * TIMEOUT_UNIT;

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

export const NUM_PHASE = 3;
export const NUM_STEP = SEQUENCES.length - 1;

export const optrTable: Record<SequenceChar, string> = {
	D: '주행',
	N: '중립',
	P: '주차',
	R: '후진',
};
