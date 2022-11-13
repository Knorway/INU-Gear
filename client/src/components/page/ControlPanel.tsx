import {
  Dispatch,
  memo,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from 'react';

import { DEFAULT_TIMEOUT, optrTable, SEQUENCES } from '~/src/config/settings';
import useSequence from '~/src/hooks/useSequence';

type Props = {
	targetSequence: typeof SEQUENCES[number];
	endSession: boolean;
	onFinish: () => void;
};

// -> eventSource도 받아와야 하고 / 아닌가 eventSource.on('message')에서 바꾼 boolean state를 넘겨줘야하나
const eventSource = { on: (a: string, fn: CallableFunction) => {} };
const onMessage = (fn: Dispatch<SetStateAction<boolean>>) => {
	eventSource.on('message', () => {
		fn(true);
	});
};

const ControlPanel = ({ targetSequence, endSession, onFinish }: Props) => {
	const [stepTimeout, setStepTimeout] = useState(0);

	const { sequence, cursor, info, utils } = useSequence(targetSequence);
	const { chars, direction, type } = sequence;
	const { current: currentCursor, starting, destination } = cursor;
	const { distance, travel, isFinished, log, duringSession } = info;
	const { indexOfChar } = utils;

	const tint = useCallback(
		(idx: number) => {
			if (idx === currentCursor) return 'green';
			if (idx === indexOfChar(destination) && duringSession) return 'crimson';
			return 'black';
		},
		[currentCursor, destination, duringSession, indexOfChar]
	);

	useEffect(() => {
		// -> receive published data && trigger
		const timeout = DEFAULT_TIMEOUT;
		setStepTimeout(timeout);

		const timeoutId = setTimeout(() => {
			onFinish();
		}, timeout);

		return () => {
			clearTimeout(timeoutId);
		};
	}, [onFinish]);

	useEffect(() => {
		if (endSession && isFinished) {
			// -> store data
			alert('세션이 종료되었습니다. \n데이터 저장 후 메인화면으로 돌아갑니다.');
			window.location.href = '/';
		}
	}, [endSession, isFinished]);

	return (
		<div className='flex space-x-8'>
			<div className='flex-1'>
				<pre>travel: {JSON.stringify(travel)}</pre>
				<pre>distance: {distance}</pre>
				<div>direction: {direction}</div>
				<div>starting: {starting}</div>
				<div>destination: {destination}</div>
				<pre>cursor: {currentCursor}</pre>
				{/* <pre>given delay: {stepTimeout ? `${stepTimeout}ms` : 'await'}</pre> */}
				<pre>diff: {log.diff ? `${log.diff}ms` : 'await'}</pre>
				<pre>
					touch:{' '}
					{log.touch! - log.init! ? `${log.touch! - log.init!}ms` : 'await'}
				</pre>
				<TimeoutCount timeout={stepTimeout} isFinished={isFinished} />
			</div>
			<div className='flex-1'>
				<div
					style={{
						fontSize: '40px',
						border: '1px solid black',
						textAlign: 'center',
					}}
				>
					{isFinished ? (
						<h1
							style={{
								visibility: isFinished ? 'visible' : 'hidden',
								fontSize: '40px',
								color: 'green',
							}}
						>
							PASS
						</h1>
					) : (
						optrTable[starting]
					)}
					{!isFinished && ' -> '}
					{duringSession && optrTable[destination]}
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
					{chars.map((e, idx) => (
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
									destination === 'P' && duringSession
										? 'crimson'
										: currentCursor === indexOfChar('P')
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
		</div>
	);
};

const TimeoutCount = (props: { timeout: number; isFinished: boolean }) => {
	const [count, setCount] = useState(props.timeout);

	useEffect(() => {
		setCount(props.timeout);
	}, [props.timeout]);

	useEffect(() => {
		// if (!props.isFinished) return;
		const intervalId = setInterval(() => {
			setCount((prev) => prev - 32);
		}, 32);

		return () => {
			clearInterval(intervalId);
		};
	}, [props.isFinished]);

	return (
		<div style={{ visibility: count !== 0 ? 'visible' : 'hidden' }}>
			<code>timeout: {count}ms</code>
			{/* <h1
				style={{
					visibility: props.isFinished ? 'visible' : 'hidden',
					fontSize: '40px',
					color: 'green',
				}}
			>
				PASS
			</h1> */}
		</div>
	);
};

export default memo(ControlPanel);

// useEffect(() => {
// 	if (type !== 'B' || destination !== 'P') return;
// 	if (direction === 'UP') {
// 		moveCursor(0);
// 	}
// 	if (direction === 'LEFT') {
// 		moveCursor(sequence.length - 1);
// 	}
// }, [destination, direction, moveCursor, sequence.length, type]);
