import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useRouter } from 'next/router';
import { Fragment, useCallback, useEffect, useMemo, useState } from 'react';

import { getSessionToken } from '~/src/api/fetcher';
import { BACKEND_URL } from '~/src/api/request';
import {
  NUM_PHASE,
  NUM_STEP,
  optrTable,
  SEQUENCES,
} from '~/src/config/settings';
import useSequence from '~/src/hooks/useSequence';

const PanelPage = () => {
	const [phase, setPhase] = useState(1);
	const [step, setStep] = useState(0);
	const [data, setData] = useState<any>([]);
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

	useEffect(() => {
		// if (!sessionToken) return;
		if (!sessionId) return;

		const eventSource = new EventSource(`${BACKEND_URL}/subscribe/${sessionId}`);

		eventSource.addEventListener('message', (e) => {
			const timeStampPre = JSON.parse(e.data).timeStamp;
			const timeStampPost = Date.now();
			setData((prev: any) => [...prev, `${timeStampPost - timeStampPre}ms`]);
		});

		eventSource.addEventListener('error', (e) => {
			console.log('error');
		});

		return () => {
			eventSource.close();
		};
	}, [sessionId]);

	if (!sessionToken || isLoading || error) return;

	return (
		<Fragment>
			{/* <button onClick={publish}>publish</button> */}
			<h1>Panel sessionId: {router.query.sessionId}</h1>
			<pre>{JSON.stringify(data, null, 2)}</pre>
			{sessionToken.sequence.map((sequence, idx) => {
				if (step === idx) {
					return (
						<Panel
							key={idx}
							targetSequence={sequence}
							onFinish={goNextStep}
							endSession={endSession}
						/>
					);
				}
			})}
		</Fragment>
	);
};

type PanelProps = {
	targetSequence: typeof SEQUENCES[number];
	endSession?: boolean;
	onFinish?: () => void;
};

const Panel = ({ targetSequence, onFinish, endSession }: PanelProps) => {
	const { sequence, cursor, info, utils } = useSequence(targetSequence);
	const { chars, direction, type } = sequence;
	const { current: currentCursor, destination, starting } = cursor;
	const { isFinished, duringSession } = info;
	const { indexOfChar } = utils;

	const tint = useCallback(
		(idx: number) => {
			if (idx === currentCursor) return 'green';
			if (idx === indexOfChar(destination) && duringSession) return 'crimson';
			return 'black';
		},
		[currentCursor, destination, duringSession, indexOfChar]
	);

	return (
		<div>
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
			</div>
		</div>
	);
};

export default PanelPage;
