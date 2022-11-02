import _ from 'lodash';
import { memo, useCallback, useEffect, useMemo, useState } from 'react';

import { DEFAULT_DELAY, Sequence, SEQUENCES } from '../util/config';

type Props = {
	targetSequence: typeof SEQUENCES[number];
	onFinish: () => void;
};

type SequenceChar = Sequence<'sequence'>[number];

const TIMEOUT_RANGE = 10;
const TIMEOUT_UNIT = 1000;
const TIMEOUT_MIN = 1 * TIMEOUT_UNIT;

const table: Record<SequenceChar, string> = {
	D: '주행',
	N: '중립',
	P: '주차',
	R: '후진',
};

const rand = (range: number) => _.random(0, range - 1);

const ControlPanel = ({ targetSequence, onFinish }: Props) => {
	const { sequence, direction, type } = targetSequence;
	const starting = useMemo(() => sequence[rand(sequence.length)], [sequence]);
	const isLeft = useMemo(() => direction === 'LEFT', [direction]);

	const destination = useMemo(() => {
		const extended = [...new Set(sequence).add('P')];
		let dest = extended[rand(extended.length)];
		while (dest === starting) {
			dest = extended[rand(extended.length)];
		}
		return dest as SequenceChar;
	}, [sequence, starting]);

	const indexOfChar = useCallback(
		(char: SequenceChar) => {
			return sequence.findIndex((e) => e === char);
		},
		[sequence]
	);

	const distance = useMemo(() => {
		if (type === 'B' && destination === 'P') return 1;
		return Math.abs(indexOfChar(destination) - indexOfChar(starting));
	}, [destination, indexOfChar, starting, type]);

	const [travel, setTravel] = useState<('L' | 'R' | 'P')[]>([]);
	const [cursor, setCursor] = useState(indexOfChar(starting));
	const [count, setCount] = useState(0);

	const isFinished = useMemo(
		() => cursor === indexOfChar(destination),
		[cursor, destination, indexOfChar]
	);

	const moveCursor = useCallback(
		(value: number) => {
			if (value < 0 || value > sequence.length - 1) return;
			setCursor(value);
		},
		[sequence.length]
	);

	const onWheelL = useCallback(
		(e: WheelEvent) => {
			const P = e.deltaY;
			const delta = isLeft ? 1 : -1;
			if (P > 0) {
				setTravel((prev) => [...prev, 'L']);
				moveCursor(cursor + delta);
			}
		},
		[cursor, isLeft, moveCursor]
	);

	const onWheelR = useCallback(
		(e: WheelEvent) => {
			const P = e.deltaY;
			const delta = isLeft ? -1 : 1;
			if (P < 0 || P === 0) {
				setTravel((prev) => [...prev, 'R']);
				moveCursor(cursor + delta);
			}
		},
		[cursor, isLeft, moveCursor]
	);

	const onClick = useCallback(() => {
		setTravel((prev) => [...prev, 'P']);
		if (destination === 'P') {
			setCursor(indexOfChar(destination));
		}
	}, [destination, indexOfChar]);

	const tint = useCallback(
		(idx: number) => {
			if (idx === cursor) return 'green';
			if (idx === indexOfChar(destination)) return 'crimson';
			return 'black';
		},
		[cursor, destination, indexOfChar]
	);

	useEffect(() => {
		const dl = _.debounce(onWheelL, DEFAULT_DELAY);
		const dr = _.debounce(onWheelR, DEFAULT_DELAY);

		window.addEventListener('wheel', dl);
		window.addEventListener('wheel', dr);
		if (type === 'B') {
			window.addEventListener('click', onClick);
		}

		return () => {
			window.removeEventListener('wheel', dl);
			window.removeEventListener('wheel', dr);
			window.removeEventListener('click', onClick);
		};
	}, [onClick, onWheelL, onWheelR, type]);

	useEffect(() => {
		if (!isFinished) return;

		const timeout = rand(TIMEOUT_RANGE) * TIMEOUT_UNIT + TIMEOUT_MIN;
		setCount(timeout);

		const timeoutId = setTimeout(() => {
			onFinish();
		}, timeout);

		const intervalId = setInterval(() => {
			setCount((prev) => prev - 10);
		}, 10);

		return () => {
			clearTimeout(timeoutId);
			clearInterval(intervalId);
		};
	}, [isFinished, onFinish]);

	// useEffect(() => {
	// 	if (type !== 'B' || destination !== 'P') return;
	// 	if (direction === 'UP') {
	// 		moveCursor(0);
	// 	}
	// 	if (direction === 'LEFT') {
	// 		moveCursor(sequence.length - 1);
	// 	}
	// }, [destination, direction, moveCursor, sequence.length, type]);

	return (
		<div>
			<pre>travel: {JSON.stringify(travel)}</pre>
			<pre>distance: {distance}</pre>
			<div>direction: {direction}</div>
			<div>starting: {starting}</div>
			<div>destination: {destination}</div>
			<pre>cursor: {cursor}</pre>
			<div style={{ visibility: count !== 0 ? 'visible' : 'hidden' }}>
				<code>timeout: {count}ms</code>
				<h1
					style={{
						visibility: isFinished ? 'visible' : 'hidden',
						fontSize: '40px',
						color: 'green',
					}}
				>
					PASS
				</h1>
			</div>
			<div
				style={{
					fontSize: '40px',
					border: '1px solid black',
					textAlign: 'center',
				}}
			>
				{table[starting]} {'->'} {table[destination]}
			</div>
			<div
				style={{
					marginTop: '10px',
					display: 'flex',
					flexDirection: direction === 'LEFT' ? 'column' : 'row',
					gap: '2px',
					fontSize: '80px',
				}}
			>
				{sequence.map((e, idx) => (
					<span
						key={idx}
						style={{
							color: tint(idx),
						}}
					>
						{e}
					</span>
				))}
			</div>
			{type === 'B' && (
				<div style={{ display: 'flex', justifyContent: 'center' }}>
					<span
						style={{
							color:
								destination === 'P'
									? 'crimson'
									: starting === 'P' && cursor === indexOfChar('P')
									? 'green'
									: 'black',
							fontSize: '80px',
						}}
					>
						P
					</span>
				</div>
			)}
		</div>
	);
};

export default memo(ControlPanel);
