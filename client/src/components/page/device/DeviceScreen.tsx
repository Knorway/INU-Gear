import { useMutation } from '@tanstack/react-query';
import { useCallback, useEffect, useRef, useState } from 'react';

import { postMessageStream } from '~/src/api/fetcher';
import {
  DEFAULT_TIMEOUT,
  MessageStream,
  ParamOf,
  SequenceChar,
  SEQUENCES,
} from '~/src/config/settings';
import { useEffectOnce } from '~/src/hooks/useEffectOnce';
import useSequence from '~/src/hooks/useSequence';

type Props = {
	targetSequence: typeof SEQUENCES[number];
	sessionId: string;
	startDest: SequenceChar[];
	onFinish: () => void;
};

const DeviceScreen = ({ targetSequence, onFinish, sessionId, startDest }: Props) => {
	const [stepTimeout, setStepTimeout] = useState(0);
	const [initialized, setInitialized] = useState(false);

	const { cursor, sequence, utils, info } = useSequence({ targetSequence, startDest });
	const { chars, type, direction } = sequence;
	const { current: currentCursor, destination, starting } = cursor;
	const { isOperational, isFinished } = info;
	const { indexOfChar } = utils;

	const { mutate: publishMessage } = useMutation({
		mutationFn: (param: ParamOf<typeof postMessageStream>) =>
			postMessageStream(param),
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
		if (destination === 'P' && isOperational) {
			return 'crimson';
		}
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

	// useEffect(() => {
	// 	if (!initialized) {
	// 		publish('initialize');
	// 		setTimeout(() => {
	// 			setInitialized(true);
	// 		}, 5000);
	// 	}
	// }, [initialized, publish]);

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

		const timeout = !initialized ? 1000 * 5 : 0;
		setStepTimeout(timeout);

		const timeoutId = setTimeout(() => {
			onFinish();
		}, timeout);

		return () => {
			clearTimeout(timeoutId);
		};
	}, [initialized, isFinished, onFinish]);

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

export default DeviceScreen;
