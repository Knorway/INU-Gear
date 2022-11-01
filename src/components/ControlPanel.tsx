import _ from 'lodash';
import { memo, useCallback, useEffect, useMemo, useState } from 'react';

import { DEFAULT_DELAY, SEQUENCES } from '../util/config';

type Props = {
	sequence: typeof SEQUENCES[number];
	onFinish: () => void;
};

const rand = (range: number) => _.random(0, range - 1);

const ControlPanel = ({ sequence, onFinish }: Props) => {
	const direction = useMemo(() => sequence.direction, [sequence.direction]);
	const starting = useMemo(
		() => sequence.sequence[rand(sequence.sequence.length)],
		[sequence.sequence]
	);

	const destination = useMemo(() => {
		let dist = sequence.sequence[rand(sequence.sequence.length)];
		while (dist === starting) {
			dist = sequence.sequence[rand(sequence.sequence.length)];
		}
		return dist;
	}, [sequence.sequence, starting]);

	const [trace, setTrace] = useState<string[]>([]);
	const [cursor, setCursor] = useState(
		sequence.sequence.findIndex((e) => e === starting)
	);

	const isFinished = useMemo(
		() => cursor === sequence.sequence.findIndex((e) => e === destination),
		[cursor, destination, sequence.sequence]
	);

	const tint = useCallback(
		(idx: number) => {
			if (idx === cursor) return 'green';
			if (idx === sequence.sequence.findIndex((e) => e === destination))
				return 'crimson';
			return 'black';
		},
		[cursor, destination, sequence.sequence]
	);

	const moveCursor = useCallback(
		(value: number) => {
			if (value < 0 || value > sequence.sequence.length - 1) return;
			setCursor(value);
		},
		[sequence.sequence.length]
	);

	const onWheelL = useCallback(
		(e: WheelEvent) => {
			const P = e.deltaY;
			const delta = !(sequence.direction === 'LEFT') ? -1 : 1;
			if (P > 0) {
				setTrace((prev) => [...prev, 'L']);
				moveCursor(cursor + delta);
			}
		},
		[cursor, moveCursor, sequence.direction]
	);

	const onWheelR = useCallback(
		(e: WheelEvent) => {
			const P = e.deltaY;
			const delta = !(sequence.direction === 'LEFT') ? 1 : -1;
			if (P < 0 || P === 0) {
				setTrace((prev) => [...prev, 'R']);
				moveCursor(cursor + delta);
			}
		},
		[cursor, moveCursor, sequence.direction]
	);

	const onClick = useCallback(() => {
		setTrace((prev) => [...prev, 'P']);
	}, []);

	useEffect(() => {
		const dl = _.debounce(onWheelL, DEFAULT_DELAY);
		const dr = _.debounce(onWheelR, DEFAULT_DELAY);

		window.addEventListener('wheel', dl);
		window.addEventListener('wheel', dr);
		if (sequence.type === 'B') {
			window.addEventListener('click', onClick);
		}

		return () => {
			window.removeEventListener('wheel', dl);
			window.removeEventListener('wheel', dr);
			window.removeEventListener('click', onClick);
		};
	}, [onClick, onWheelL, onWheelR, sequence.type]);

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
				distance:{' '}
				{Math.abs(
					sequence.sequence.findIndex((e) => e === destination) -
						sequence.sequence.findIndex((e) => e === starting)
				)}
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
				{sequence.sequence.map((e, idx) => (
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
			{sequence.direction === 'LEFT' && <span>P</span>}
			{isFinished && <h1>통과!</h1>}
		</div>
	);
};

export default memo(ControlPanel);
