import { useMutation } from '@tanstack/react-query';
import { useCallback, useEffect, useState } from 'react';

import { postMessageStream } from '~/src/api/fetcher';
import { DEFAULT_TIMEOUT, SEQUENCES } from '~/src/config/settings';
import useSequence from '~/src/hooks/useSequence';

type ParamOf<T extends (...args: any) => any> = Parameters<T>[0];

type Props = {
	targetSequence: typeof SEQUENCES[number];
	endSession: boolean;
	onFinish: () => void;
	sessionId: string;
};

const DeviceScreen = ({ targetSequence, endSession, onFinish, sessionId }: Props) => {
	const [stepTimeout, setStepTimeout] = useState(0);

	const { cursor, sequence, utils, info } = useSequence(targetSequence);
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
			if (idx === currentCursor) return 'green';
			if (idx === indexOfChar(destination) && isOperational) return 'crimson';
			return 'black';
		},
		[currentCursor, destination, isOperational, indexOfChar]
	);

	const publish = useCallback(() => {
		if (!sessionId) return;

		publishMessage({
			uuid: sessionId,
			message: {
				timeStamp: Date.now(),
				cursor: { starting, destination },
				isOperational,
				isFinished,
			},
		});
	}, [destination, isOperational, isFinished, publishMessage, sessionId, starting]);

	useEffect(() => {
		publish();
	}, [publish]);

	useEffect(() => {
		const timeout = DEFAULT_TIMEOUT;
		setStepTimeout(timeout);

		const timeoutId = setTimeout(() => {
			onFinish();
		}, timeout);

		return () => {
			clearTimeout(timeoutId);
		};
	}, [onFinish]);

	return (
		<div>
			{/* <button onClick={publish}>publish</button> */}
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
								color:
									destination === 'P' && isOperational
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

export default DeviceScreen;
