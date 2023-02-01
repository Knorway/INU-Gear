import _ from 'lodash';

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
	};
};

export type MessageStream = {
	message: {
		timeStamp: number;
		cursor: {
			starting: SequenceChar;
			destination: SequenceChar;
		};
		isOperational: boolean;
		isFinished: boolean;
	};
	complete: boolean;
	error: boolean;
};

// const f = <T extends keyof MessageStream>(x: { key: T; value: MessageStream[T] }) => true;
// f({ key: 'complete', value: false });

export const DEBOUNCE_DELAY = 40;
export const REPETITION_LIMIT = 1;
export const OFFSET_DELAY = 32; // TODO: need to check later
export const TRIAL_DELAY = [
	7, 6, 5, 5, 6, 8, 5, 7, 8, 5, 8, 8, 7, 6, 5, 6, 7, 8, 6, 6, 6, 7, 6, 6,
].map((e) => e * 1000 + OFFSET_DELAY);
export const TRIAL_REPEAT = TRIAL_DELAY.length;

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
