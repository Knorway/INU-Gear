import { useMutation } from '@tanstack/react-query';
import { useCallback, useEffect, useMemo, useState } from 'react';

import { postMessageStream } from '~/src/api/fetcher';
import { mutationizeFetcher } from '~/src/api/queryClient';
import {
  MessageStream,
  SequenceChar,
  SEQUENCES,
  SessionLogResult,
} from '~/src/config/settings';
import { useEffectOnce } from '~/src/hooks/useEffectOnce';
import useSequence from '~/src/hooks/useSequence';

type Props = {
	targetSequence: typeof SEQUENCES[number];
	sessionId: string;
	startDest: SequenceChar[];
	onFinish: (log: SessionLogResult) => void;
};

const DeviceScreen = ({ targetSequence, onFinish, sessionId, startDest }: Props) => {
	const [stepTimeout, setStepTimeout] = useState(0);
	const [initialized, setInitialized] = useState(false);

	const { cursor, sequence, utils, info } = useSequence({ targetSequence, startDest });
	const { chars, type, direction } = sequence;
	const { current: currentCursor, destination, starting } = cursor;
	const { isOperational, isFinished, distance, log, travel } = info;
	const { indexOfChar } = utils;

	const { mutate: publishMessage } = useMutation({
		mutationFn: mutationizeFetcher(postMessageStream),
	});

	const tint = useCallback(
		(idx: number) => {
			if (!initialized) return 'black';
			if (idx === currentCursor) return 'green';
			if (idx === indexOfChar(destination) && isOperational) return 'crimson';
			return 'black';
		},
		[currentCursor, destination, indexOfChar, initialized, isOperational]
	);

	const tintP = useCallback(() => {
		if (!initialized) return 'black';
		if (destination === 'P' && isOperational) return 'crimson';
		return currentCursor === indexOfChar('P') ? 'green' : 'black';
	}, [currentCursor, destination, indexOfChar, initialized, isOperational]);

	const publish = useCallback(
		(type: MessageStream['type']) => {
			if (!sessionId) return;

			publishMessage({
				uuid: sessionId,
				message: {
					type,
					payload: {
						timeStamp: Date.now(),
						cursor: { starting, destination },
						isOperational,
						isFinished,
					},
				},
			});
		},
		[destination, isOperational, isFinished, publishMessage, sessionId, starting]
	);

	useEffectOnce(() => {
		publish('initialize');
		setTimeout(() => {
			setInitialized(true);
		}, 5000);
	});

	useEffect(() => {
		if (initialized) {
			publish('message');
		}
	}, [initialized, publish]);

	useEffect(() => {
		if (!isFinished) return;

		const resultLog = {
			sequence: targetSequence.sequence,
			starting: cursor.starting,
			destination: cursor.destination,
			type: sequence.type,
			direction: sequence.direction,
			distance: info.distance,
			travel: info.travel.length,
			logs: {
				init: log.init,
				touch: log.touch - log.init,
				pass: log.pass,
				diff: log.diff,
			},
		};

		const timeout = !initialized ? 1000 * 5 : 0;
		setStepTimeout(timeout);

		const timeoutId = setTimeout(() => {
			onFinish(resultLog);
		}, timeout);

		return () => {
			clearTimeout(timeoutId);
		};
	}, [cursor, info, initialized, isFinished, log, onFinish, sequence, targetSequence]);

	return (
		<div>
			<div className='flex-1'>
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
								color: tintP(),
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
		</div>
	);
};

export default DeviceScreen;

{
	/* <div>
				<p>logging infomation</p>
				<pre>travel: {JSON.stringify(travel)}</pre>
				<pre>distance: {distance}</pre>
				<div>direction: {direction}</div>
				<div>starting: {starting}</div>
				<div>destination: {destination}</div>
				<pre>cursor: {currentCursor}</pre>
				<pre>diff: {log.diff ? `${log.diff}ms` : 'await'}</pre>
				<pre>
					touch:{' '}
					{log.touch! - log.init! ? `${log.touch! - log.init!}ms` : 'await'}
				</pre>
				<TimeoutCount timeout={stepTimeout} isFinished={isFinished} />
			</div> */
}
