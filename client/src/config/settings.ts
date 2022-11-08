export type Sequence<T extends keyof typeof SEQUENCES[number]> =
	typeof SEQUENCES[number][T];

export type SequenceChar = Sequence<'sequence'>[number];

export type ResultData = {
	sequence: typeof SEQUENCES[number];
	starting: SequenceChar;
	destination: SequenceChar;
	type: Sequence<'type'>;
	direction: Sequence<'direction'>;
	distance: number;
	travel: number;
	logs: {
		init?: number;
		touch?: number;
		pass?: number;
		diff?: number;
		delay?: number;
	};
};

export const DEFAULT_DELAY = 30;
export const DEFAULT_TIMEOUT = 1000 * 10;

export const TIMEOUT_UNIT = 1000;
export const TIMEOUT_RANGE = 4;
export const TIMEOUT_MIN = 3 * TIMEOUT_UNIT;

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

// array 순서는 정할 수 있어야 되고
// -> 6 * length * 3(location)
// 최종 사용자 화면은

export const NUM_PHASE = 3;
export const NUM_STEP = SEQUENCES.length - 1;

export const optrTable: Record<SequenceChar, string> = {
	D: '주행',
	N: '중립',
	P: '주차',
	R: '후진',
};
