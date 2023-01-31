import { useMutation } from '@tanstack/react-query';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { mutatation } from '~/src/api/fetcher';
import {
  DEFAULT_OFFSET,
  FIVE_SECONDS,
  MessageStream,
  SequenceChar,
  SEQUENCES,
  SessionLogResult,
} from '~/src/config/settings';
import { useEffectOnce } from '~/src/hooks/useEffectOnce';
import useSequence from '~/src/hooks/useSequence';
import { useSound } from '~/src/hooks/useSound';

import Char from './Char';

type Props = {
	targetSequence: typeof SEQUENCES[number];
	sessionId: string;
	startDest: SequenceChar[];
	randHold: number;
	onFinish: (log: SessionLogResult) => void;
};

const DeviceScreen = ({
	targetSequence,
	onFinish,
	sessionId,
	startDest,
	randHold,
}: Props) => {
	const [initialized, setInitialized] = useState(false);

	const { cursor, sequence, info } = useSequence({
		targetSequence,
		startDest,
		randHold,
	});
	const { chars, direction } = sequence;
	const { current: currentCursor, destination, starting } = cursor;
	const { isOperational, isFinished, log } = info;

	const [msgSentCount, setMsgSentCount] = useState(0);
	const GEAR_RELEASED = useMemo(() => msgSentCount === 3, [msgSentCount]);

	const isLeft = useMemo(() => direction === 'LEFT', [direction]);
	const isTrialFinished = useMemo(() => isFinished && log.pass, [isFinished, log.pass]);

	const { playSound } = useSound({ fileName: 'MP_Beep.mp3' });

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
			setMsgSentCount((prev) => prev + 1);
		},
		[destination, isOperational, isFinished, publishMessage, sessionId, starting]
	);

	const tint = useCallback(
		(idx: number) => {
			if (!GEAR_RELEASED) return 'black';
			if (idx === currentCursor) return 'rgb(250 204 21)';
			return 'black';
		},
		[GEAR_RELEASED, currentCursor]
	);

	useEffectOnce(() => {
		publish('initialize');
		setTimeout(() => {
			setInitialized(true);
		}, FIVE_SECONDS);
	});

	useEffect(() => {
		if (initialized) {
			publish('message');
		}
	}, [initialized, publish]);

	useEffect(() => {
		if (GEAR_RELEASED) {
			playSound();
		}
	}, [GEAR_RELEASED, playSound]);

	useEffect(() => {
		if (!isTrialFinished) return;

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

		onFinish(resultLog);
	}, [cursor, info, isTrialFinished, log, onFinish, sequence, targetSequence.sequence]);

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
