export type Sequence<T extends keyof typeof SEQUENCES[number]> =
	typeof SEQUENCES[number][T];

export type SequenceChar = Sequence<'sequence'>[number];

export type SessionLogResult = {
	sequence: Sequence<'sequence'>;
	starting: SequenceChar;
	destination: SequenceChar;
	type: Sequence<'type'>;
	direction: Sequence<'direction'>;
	distance: number;
	travel: number;
	logs: {
		init: number;
		touch: number;
		pass: number;
		diff: number;
		// delay: number;
	};
};

export type MessageStream = {
	type: 'initialize' | 'message' | 'complete' | 'error';
	payload: {
		timeStamp: number;
		cursor: {
			starting: SequenceChar;
			destination: SequenceChar;
		};
		isOperational: boolean;
		isFinished: boolean;
	} | null;
};

export const DEFAULT_DELAY = 40;
export const DEFAULT_TIMEOUT = 1000 * 10;

export const TIMEOUT_UNIT = 1000;
export const TIMEOUT_RANGE = 4;
export const TIMEOUT_MIN = 3 * TIMEOUT_UNIT;

export const REPETITION_LIMIT = 1;

export const TRIAL_REPEAT = 6;

export const SEQUENCES = [
	{
		type: 'A',
		direction: 'UP',
		sequence: ['P', 'R', 'N', 'D'],
		repetition: 0 as number,
	},
	{
		type: 'A',
		direction: 'UP',
		sequence: ['D', 'N', 'R', 'P'],
		repetition: 0 as number,
	},
	{
		type: 'A',
		direction: 'LEFT',
		sequence: ['P', 'R', 'N', 'D'],
		repetition: 0 as number,
	},
	{
		type: 'A',
		direction: 'LEFT',
		sequence: ['D', 'N', 'R', 'P'],
		repetition: 0 as number,
	},

	{ type: 'B', direction: 'UP', sequence: ['R', 'N', 'D'], repetition: 0 as number },
	{ type: 'B', direction: 'UP', sequence: ['D', 'N', 'R'], repetition: 0 as number },
	{ type: 'B', direction: 'LEFT', sequence: ['R', 'N', 'D'], repetition: 0 as number },
	{ type: 'B', direction: 'LEFT', sequence: ['D', 'N', 'R'], repetition: 0 as number },
] as const;

export const NUM_PHASE = 3;
export const NUM_STEP = SEQUENCES.length - 1;

export const optrTable: Record<SequenceChar, string> = {
	D: '주행',
	N: '중립',
	P: '주차',
	R: '후진',
};
