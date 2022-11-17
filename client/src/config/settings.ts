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
		init?: number;
		touch?: number;
		pass?: number;
		diff?: number;
		delay?: number;
	};
};

export type MessageStream = {
	timeStamp: number;
	cursor: {
		starting: SequenceChar;
		destination: SequenceChar;
	};
	isOperational: boolean;
	isFinished: boolean;
};

export const DEFAULT_DELAY = 40;
export const DEFAULT_TIMEOUT = 1000 * 10;

export const TIMEOUT_UNIT = 1000;
export const TIMEOUT_RANGE = 4;
export const TIMEOUT_MIN = 3 * TIMEOUT_UNIT;

export const REPETITION_LIMIT = 1;

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

// spacing, 4.5 for rest operation!(custom), no timeout, 5 secs of rest
// -> configurable
// 현재 ~상태 입니다 / ~상태로 변속하세요
// 여섯개 한뭉탱이 시작, 종료 여유
// 랜덤인데 이미 진행한 조합은 방향을 막론하고 다음번 랜덤에서 제외되어야 한다
// 6 * 8 * 3. 세션 토큰 진행상황 표시?

// 홍길동 남 1/8
// 록맨 https://www.google.com/search?q=%EB%A1%9D%EB%A7%A8&sxsrf=ALiCzsZOaOZn1KRRXT5O0LJiRjhcGLQO2w:1668603324681&source=lnms&tbm=isch&sa=X&ved=2ahUKEwij0cDj37L7AhXwrlYBHQcVAhsQ_AUoAXoECAIQAw&biw=1440&bih=733&dpr=2#imgrc=SfycwtwKxUvNfM

export const NUM_PHASE = 3;
export const NUM_STEP = SEQUENCES.length - 1;

export const optrTable: Record<SequenceChar, string> = {
	D: '주행',
	N: '중립',
	P: '주차',
	R: '후진',
};
