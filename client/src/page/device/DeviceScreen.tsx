import { useMutation } from '@tanstack/react-query';
import { useCallback, useEffect, useMemo, useState } from 'react';

import { mutatation } from '~/src/api/fetcher';
import {
  MessageStream,
  SequenceChar,
  SEQUENCES,
  SessionLogResult,
} from '~/src/config/settings';
import useSequence from '~/src/hooks/useSequence';
import { useSound } from '~/src/hooks/useSound';

import Char from './Char';

type Props = {
	targetSequence: typeof SEQUENCES[number];
	sessionId: string;
	startDest: SequenceChar[];
	trialDelay: number;
	onFinish: (log: SessionLogResult) => void;
};

const DeviceScreen = ({
	targetSequence,
	onFinish,
	sessionId,
	startDest,
	trialDelay,
}: Props) => {
	const { cursor, sequence, info } = useSequence({
		targetSequence,
		startDest,
		trialDelay,
	});
	const { chars, direction } = sequence;
	const { current: currentCursor, destination, starting } = cursor;
	const { isOperational, isFinished, log } = info;

	const [msgSentCount, setMsgSentCount] = useState(0);
	const GEAR_RELEASED = useMemo(() => msgSentCount === 2, [msgSentCount]);

	const isLeft = useMemo(() => direction === 'LEFT', [direction]);
	const isTrialFinished = useMemo(() => isFinished && log.pass, [isFinished, log.pass]);

	const { playSound } = useSound({ fileName: 'MP_Beep.mp3' });

	const { mutate: publishMessage } = useMutation({
		mutationFn: mutatation.postMessageStream,
	});

	const publish = useCallback(
		(type: keyof MessageStream) => {
			if (!sessionId) return;

			publishMessage({
				uuid: sessionId,
				message: {
					type: 'message',
					data: {
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

	useEffect(() => {
		publish('message');
	}, [publish]);

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
