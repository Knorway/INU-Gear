import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import { Fragment, useCallback, useEffect, useMemo, useState } from 'react';

import { mutatation } from '~/src/api/fetcher';
import {
	SEQUENCES,
	SessionLogResult,
	TRIAL_DELAY,
	TRIAL_REPEAT,
} from '~/src/config/settings';
import DeviceScreen from '~/src/page/device/DeviceScreen';
import { deduplicate, generateStartDest } from '~/src/utils';

import TrialDeviceScreen from './TrialDeviceScreen';

const DevicePage = () => {
	const [sequences, setSequences] = useState<(typeof SEQUENCES)[number][] | null>(null);
	const [step, setStep] = useState(0);
	const [resultLogs, setResultLogs] = useState<SessionLogResult[]>([]);
	const [go, setGo] = useState(false);

	const router = useRouter();
	const sessionId = router.query.sessionId as string;

	const { mutate: publishMessage } = useMutation({
		mutationFn: mutatation.postMessageStream,
	});
	const { mutate: createLog } = useMutation({
		mutationFn: mutatation.postSessionLog,
	});

	const startDest = useMemo(
		() => deduplicate(generateStartDest(sequences?.[0].sequence)),
		[sequences]
	);

	const goNextStep = useCallback(
		(log: SessionLogResult) => {
			if (step !== TRIAL_REPEAT) {
				setStep((prev) => prev + 1);
				setResultLogs((prev) => [...prev, log]);
			}
		},
		[step]
	);

	useEffect(() => {
		try {
			const parsed = JSON.parse(router.query.sequence as string);
			setSequences(Array(TRIAL_REPEAT).fill(parsed));
		} catch (error) {
			setSequences(null);
		}
	}, [router.query.sequence]);

	useEffect(() => {
		if (!sessionId) return;

		if (step === TRIAL_REPEAT) {
			createLog(
				{
					uuid: sessionId,
					logs: resultLogs,
					sequence: sequences![0],
				},
				{
					onSuccess: () => {
						publishMessage({
							uuid: sessionId as string,
							message: {
								type: 'complete',
								data: true,
							},
						});
						router.push('/');
					},
					onError: () => {
						publishMessage({
							uuid: sessionId as string,
							message: {
								type: 'error',
								data: true,
							},
						});
					},
				}
			);
		}
	}, [createLog, publishMessage, resultLogs, router, sequences, sessionId, step]);

	if (!sequences || !sessionId) return null;

	return (
		<Fragment>
			{/* <Debug resultLogs={resultLogs} /> */}
			{!go && (
				<TrialDeviceScreen
					trigger={() => setGo((prev) => !prev)}
					targetSequence={sequences[0]}
					startDest={startDest[step]}
				/>
			)}
			{go &&
				sequences.map((sequence, idx) => {
					if (step === idx) {
						return (
							<DeviceScreen
								key={idx}
								targetSequence={sequence}
								startDest={startDest[step]}
								trialDelay={TRIAL_DELAY[idx]}
								sessionId={sessionId}
								onFinish={goNextStep}
							/>
						);
					}
				})}
		</Fragment>
	);
};

const Debug = ({ resultLogs }: { resultLogs: SessionLogResult[] }) => {
	// type, dir, starting, dees, distance, travel, logs
	return (
		<div style={{ position: 'absolute', left: '45%' }}>
			<pre>
				{resultLogs.at(-1) &&
					JSON.stringify(
						{
							type: resultLogs.at(-1)?.type,
							direction: resultLogs.at(-1)?.direction,
							starting: resultLogs.at(-1)?.starting,
							destination: resultLogs.at(-1)?.destination,
							distance: resultLogs.at(-1)?.distance,
							travel: resultLogs.at(-1)?.travel,
							erorr: (resultLogs.at(-1)?.logs as any)?.error,
						},
						null,
						2
					)}
			</pre>
		</div>
	);
};

export default DevicePage;
