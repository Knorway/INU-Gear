import _ from 'lodash';

// type SeqeunceType = {
// 	direction: 'UP' | 'LEFT';
// 	sequence: typeof SEQUENCES[number];
// 	type: 'A' | 'B';
// };

export const DEFAULT_DELAY = 30;

export const SEQUENCES = [
	['UP', 'P', 'R', 'N', 'D'],
	['UP', 'D', 'N', 'R', 'P'],
	['UP', 'R', 'N', 'D'],
	['UP', 'D', 'N', 'R'],
	['LEFT', 'P', 'R', 'N', 'D'],
	['LEFT', 'D', 'N', 'R', 'P'],
	['LEFT', 'R', 'N', 'D'],
	['LEFT', 'D', 'N', 'R'],
];

// export const SEQ: SeqeunceType[] = [
// 	{ direction: 'LEFT', sequence: ['UP', 'D', 'N', 'R'], type: 'A' },
// ];

const SEQUENCES_B = [
	{ direction: 'UP', sequence: ['P', 'N', 'R', 'D'], type: 'A' },
	{ direction: 'UP', sequence: ['D', 'N', 'R', 'P'], type: 'A' },
	{ direction: 'DOWN', sequence: ['P', 'R', 'N', 'D'], type: 'A' },
	{ direction: 'DOWN', sequence: ['D', 'N', 'R', 'P'], type: 'A' },
	{ direction: 'UP', sequence: ['R', 'N', 'D'], type: 'B' },
	{ direction: 'UP', sequence: ['D', 'N', 'R'], type: 'B' },
	{ direction: 'DOWN', sequence: ['R', 'N', 'D'], type: 'B' },
	{ direction: 'DOWN', sequence: ['D', 'N', 'R'], type: 'B' },
] as const;

// if (a[1].sequence === [] as ) {
// }

type SEQ<T extends keyof typeof SEQUENCES_B[number]> = typeof SEQUENCES_B[number][T];

SEQUENCES_B[0].sequence === (['D', 'N', 'R'] as SEQ<'sequence'>);
SEQUENCES_B[0].type;

const b = _.shuffle(SEQUENCES_B);

if (b[0].sequence === (['R', 'N', 'D'] as SEQ<'sequence'>)) {
}
