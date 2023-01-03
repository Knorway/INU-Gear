import { useMutation } from '@tanstack/react-query';
import { useCallback, useEffect, useMemo, useState } from 'react';

import { mutatation } from '~/src/api/fetcher';
import {
  MessageStream,
  SequenceChar,
  SEQUENCES,
  SessionLogResult,
} from '~/src/config/settings';
import { useEffectOnce } from '~/src/hooks/useEffectOnce';
import useSequence from '~/src/hooks/useSequence';

import Char from './Char';

type Props = {
	targetSequence: typeof SEQUENCES[number];
	sessionId: string;
	startDest: SequenceChar[];
	onFinish: (log: SessionLogResult) => void;
};

const DeviceScreen = ({ targetSequence, onFinish, sessionId, startDest }: Props) => {
	const [, setStepTimeout] = useState(0);
	const [initialized, setInitialized] = useState(false);

	// console.log(startDest);

	const { cursor, sequence, info } = useSequence({ targetSequence, startDest });
	const { chars, direction } = sequence;
	const { current: currentCursor, destination, starting } = cursor;
	const { isOperational, isFinished, log, distance } = info;

	const isLeft = useMemo(() => direction === 'LEFT', [direction]);

	const { mutate: publishMessage } = useMutation({
		mutationFn: mutatation.postMessageStream,
	});

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

	const tint = useCallback(
		(idx: number) => {
			if (!initialized) return 'black';
			if (idx === currentCursor) return 'rgb(250 204 21)';
			return 'black';
		},
		[currentCursor, initialized]
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
				error: log.error,
			},
		} as SessionLogResult;

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
		<div className='overflow-hidden'>
			<div
				className={`inline-flex items-center justify-center h-screen w-screen
				${isLeft ? 'rotate-90' : ''} 
				`}
			>
				<div
					className={`flex text-9xl select-none ${
						isLeft ? 'flex-col space-y-8' : 'flex-row space-x-8'
					} `}
				>
					{chars.map((char, idx) => (
						<Char key={char} char={char} tint={tint(idx)} />
					))}
				</div>
			</div>
		</div>
	);
};

export default DeviceScreen;
