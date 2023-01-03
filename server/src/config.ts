export type SessionToken = {
	id: number;
	uuid: string;
	createdAt: Date;
	mangerId: number;
	sequence: typeof SEQUENCES;
	repetition: number;
};

export type Sequence<T extends keyof typeof SEQUENCES[number]> =
	typeof SEQUENCES[number][T];

export type SequenceChar = Sequence<'sequence'>[number];

export type SessionLogResult = {
	sequence: typeof SEQUENCES[number];
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
		error: number;
		// delay: number;
	};
};
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

export const TEMP_MANAGER_ID = 3;
