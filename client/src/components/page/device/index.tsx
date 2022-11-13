import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useRouter } from 'next/router';
import { Fragment, useCallback, useEffect, useMemo, useState } from 'react';

import { getSessionToken } from '~/src/api/fetcher';
import { BACKEND_URL } from '~/src/api/request';
import {
  DEFAULT_TIMEOUT,
  NUM_PHASE,
  NUM_STEP,
  optrTable,
  SEQUENCES,
} from '~/src/config/settings';
import useSequence from '~/src/hooks/useSequence';

const DevicePage = () => {
	const [phase, setPhase] = useState(1);
	const [step, setStep] = useState(0);
	const router = useRouter();
	const sessionId = router.query.sessionId;

	const endSession = useMemo(
		() => phase === NUM_PHASE && step === NUM_STEP,
		[phase, step]
	);

	const {
		data: sessionToken,
		isLoading,
		error,
	} = useQuery({
		queryKey: ['sessionToken', sessionId],
		queryFn: () => getSessionToken({ uuid: sessionId as string }),
		enabled: Boolean(sessionId),
	});

	const goNextPhase = useCallback(() => {
		if (phase >= NUM_PHASE) return;
		setPhase((prev) => prev + 1);
		setStep(0);
		// setSessionSequences(_.shuffle(SEQUENCES));
	}, [phase]);

	const goNextStep = useCallback(() => {
		if (step < NUM_STEP) {
			return setStep((prev) => prev + 1);
		}
		goNextPhase();
	}, [goNextPhase, step]);

	if (!sessionToken || error || isLoading) return null;

	return (
		<Fragment>
			<pre>Device session: {sessionToken?.uuid}</pre>
			{/* <pre>{JSON.stringify(data, null, 2)}</pre> */}

			{sessionToken.sequence.map((sequence, idx) => {
				if (step === idx) {
					return (
						<Panel
							key={idx}
							targetSequence={sequence}
							onFinish={goNextStep}
							endSession={endSession}
							uuid={sessionToken.uuid}
						/>
					);
				}
			})}
		</Fragment>
	);
};

type PanelProps = {
	targetSequence: typeof SEQUENCES[number];
	endSession: boolean;
	onFinish: () => void;
	uuid: string;
};

const Panel = ({ targetSequence, endSession, onFinish, uuid }: PanelProps) => {
	const [stepTimeout, setStepTimeout] = useState(0);

	const { cursor, sequence, utils, info } = useSequence(targetSequence);
	const { chars, type, direction } = sequence;
	const { current: currentCursor, destination, starting } = cursor;
	const { duringSession, isFinished } = info;
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

	// const publish = useCallback(() => {
	// 	// if (!sessionToken) return;
	// 	if (!sessionId) return;

	// 	axios.post(`${BACKEND_URL}/publish/${sessionId}`, {
	// 		timeStamp: Date.now(),
	// 	});
	// }, [sessionId]);

	useEffect(() => {
		if (!isFinished) return;

		axios.post(`${BACKEND_URL}/publish/${uuid}`, {
			timeStamp: Date.now(),
		});
	}, [isFinished, uuid]);

	return (
		<div>
			<div className='flex-1'>
				{/* <div
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
				</div> */}

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

export default DevicePage;
