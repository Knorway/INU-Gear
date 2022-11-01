import _ from 'lodash';
import { memo, useCallback, useEffect, useMemo, useState } from 'react';

import { DEFAULT_DELAY, Sequence, SEQUENCES } from '../util/config';

type Props = {
	targetSequence: typeof SEQUENCES[number];
	onFinish: () => void;
};

const rand = (range: number) => _.random(0, range - 1);

const ControlPanel = ({ targetSequence, onFinish }: Props) => {
	const { sequence, direction, type } = targetSequence;
	const starting = useMemo(() => sequence[rand(sequence.length)], [sequence]);
	const isLeft = useMemo(() => direction === 'LEFT', [direction]);

	const destination = useMemo(() => {
		let dist = sequence[rand(sequence.length)];
		while (dist === starting) {
			dist = sequence[rand(sequence.length)];
		}
		return dist;
	}, [sequence, starting]);

	const indexOfChar = useCallback(
		(char: Sequence<'sequence'>[number]) => {
			return sequence.findIndex((e) => e === char);
		},
		[sequence]
	);

	const [trace, setTrace] = useState<string[]>([]);
	const [cursor, setCursor] = useState(indexOfChar(starting));

	const isFinished = useMemo(
		() => cursor === indexOfChar(destination),
		[cursor, destination, indexOfChar]
	);

	const tint = useCallback(
		(idx: number) => {
			if (idx === cursor) return 'green';
			if (idx === indexOfChar(destination)) return 'crimson';
			return 'black';
		},
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
				setTrace((prev) => [...prev, 'L']);
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
				setTrace((prev) => [...prev, 'R']);
				moveCursor(cursor + delta);
			}
		},
		[cursor, isLeft, moveCursor]
	);

	const onClick = useCallback(() => {
		setTrace((prev) => [...prev, 'P']);
	}, []);

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
		if (isFinished) {
			setTimeout(() => {
				onFinish();
			}, 700);
		}
	}, [isFinished, onFinish]);

	return (
		<div>
			<pre>travel: {JSON.stringify(trace)}</pre>
			<pre>
				distance: {Math.abs(indexOfChar(destination) - indexOfChar(starting))}
			</pre>
			<div>direction: {direction}</div>
			<div>starting: {starting}</div>
			<div>destination: {destination}</div>
			<pre>cursor: {cursor}</pre>
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
			{isLeft && <span>P</span>}
			{isFinished && <h1>통과!</h1>}
		</div>
	);
};

export default memo(ControlPanel);
