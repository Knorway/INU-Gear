import _ from 'lodash';
import { memo, useCallback, useEffect, useMemo, useState } from 'react';

import { DEFAULT_DELAY, SEQUENCES } from '../util/config';

type Props = {
	sequence: typeof SEQUENCES[number];
	onFinish: () => void;
};

const rand = (range: number) => _.random(0, range - 1);

const ControlPanel = ({ sequence, onFinish }: Props) => {
	const copied = useMemo(() => sequence.slice(), [sequence]);
	const direction = useMemo(() => copied.shift(), [copied]);
	const starting = useMemo(() => copied[rand(copied.length)], [copied]);

	const destination = useMemo(() => {
		let dist = copied[rand(copied.length)];
		while (dist === starting) {
			dist = copied[rand(copied.length)];
		}
		return dist;
	}, [copied, starting]);

	const SEQ_TYPE_B = useMemo(() => copied.length === 3, [copied.length]);
	const IS_LEFT = useMemo(() => direction === 'LEFT', [direction]);

	const [trace, setTrace] = useState<string[]>([]);
	const [cursor, setCursor] = useState(copied.indexOf(starting));

	const isFinished = useMemo(
		() => cursor === copied.indexOf(destination),
		[copied, destination, cursor]
	);

	const tint = useCallback(
		(idx: number) => {
			if (idx === cursor) return 'green';
			if (idx === copied.indexOf(destination)) return 'crimson';
			return 'black';
		},
		[copied, destination, cursor]
	);

	const moveCursor = useCallback(
		(value: number) => {
			if (value < 0 || value > copied.length - 1) return;
			setCursor(value);
		},
		[copied.length]
	);

	const onWheelL = useCallback(
		(e: WheelEvent) => {
			const P = e.deltaY;
			const delta = !IS_LEFT ? -1 : 1;
			if (P > 0) {
				setTrace((prev) => [...prev, 'L']);
				moveCursor(cursor + delta);
			}
		},
		[IS_LEFT, moveCursor, cursor]
	);

	const onWheelR = useCallback(
		(e: WheelEvent) => {
			const P = e.deltaY;
			const delta = !IS_LEFT ? 1 : -1;
			if (P < 0 || P === 0) {
				setTrace((prev) => [...prev, 'R']);
				moveCursor(cursor + delta);
			}
		},
		[IS_LEFT, moveCursor, cursor]
	);

	const onClick = useCallback(() => {
		setTrace((prev) => [...prev, 'P']);
	}, []);

	useEffect(() => {
		const dl = _.debounce(onWheelL, DEFAULT_DELAY);
		const dr = _.debounce(onWheelR, DEFAULT_DELAY);

		window.addEventListener('wheel', dl);
		window.addEventListener('wheel', dr);
		if (SEQ_TYPE_B) {
			window.addEventListener('click', onClick);
		}

		return () => {
			window.removeEventListener('wheel', dl);
			window.removeEventListener('wheel', dr);
			window.removeEventListener('click', onClick);
		};
	}, [SEQ_TYPE_B, onClick, onWheelL, onWheelR]);

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
				{Math.abs(copied.indexOf(destination) - copied.indexOf(starting))}
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
				{copied.map((e, idx) => (
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
			{IS_LEFT && <span>P</span>}
			{isFinished && <h1>통과!</h1>}
		</div>
	);
};

export default memo(ControlPanel);
