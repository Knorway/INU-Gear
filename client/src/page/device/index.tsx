import { useMutation } from '@tanstack/react-query';
import _ from 'lodash';
import { useRouter } from 'next/router';
import { Fragment, useCallback, useEffect, useMemo, useState } from 'react';

import { mutatation } from '~/src/api/fetcher';
import {
  SEQUENCES,
  SessionLogResult,
  TRIAL_REPEAT,
} from '~/src/config/settings';
import DeviceScreen from '~/src/page/device/DeviceScreen';
import { generateStartDest } from '~/src/utils';

const DevicePage = () => {
	const [sequences, setSequences] = useState<typeof SEQUENCES[number][] | null>(null);
	const [step, setStep] = useState(0);
	const [resultLogs, setResultLogs] = useState<SessionLogResult[]>([]);

	console.log(resultLogs);

	const router = useRouter();
	const sessionId = router.query.sessionId as string;

	const { mutate: publishMessage } = useMutation({
		mutationFn: mutatation.postMessageStream,
	});
	const { mutate: createLog } = useMutation({
		mutationFn: mutatation.postSessionLog,
	});

	const startDest = useMemo(() => {
		const gen = generateStartDest(sequences?.[0].sequence);
		// return _.shuffle(gen.concat(gen));
		return gen;
	}, [sequences]);

	// console.log(startDest);
	// console.log(resultLogs);

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
				{ uuid: sessionId, logs: resultLogs, sequence: sequences![0] },
				{
					onSuccess: () => {
						publishMessage({
							uuid: sessionId as string,
							message: {
								type: 'complete',
								payload: null,
							},
						});
						router.push('/');
					},
					onError: () => {
						publishMessage({
							uuid: sessionId as string,
							message: {
								type: 'error',
								payload: null,
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
			{sequences.map((sequence, idx) => {
				if (step === idx) {
					return (
						<DeviceScreen
							key={idx}
							targetSequence={sequence}
							startDest={startDest[step]}
							sessionId={sessionId}
							onFinish={goNextStep}
						/>
					);
				}
			})}
		</Fragment>
	);
};

export default DevicePage;
