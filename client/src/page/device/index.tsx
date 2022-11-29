import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import { Fragment, useCallback, useEffect, useMemo, useState } from 'react';

import { mutatation } from '~/src/api/fetcher';
import { mutationizeFetcher } from '~/src/api/queryClient';
import { SEQUENCES, SessionLogResult } from '~/src/config/settings';
import DeviceScreen from '~/src/page/device/DeviceScreen';
import { generateStartDest } from '~/src/utils';

const STEP_LIMIT = 6;

const DevicePage = () => {
	const [sequences, setSequences] = useState<typeof SEQUENCES[number][] | null>(null);
	const [step, setStep] = useState(0);
	const [resultLogs, setResultLogs] = useState<SessionLogResult[]>([]);

	const router = useRouter();
	const sessionId = router.query.sessionId as string;

	const { mutate: publishMessage, isSuccess: successPublishing } = useMutation({
		mutationFn: mutatation.postMessageStream,
	});
	const { mutate: updateSequnce, isSuccess: successUpdatingSequence } = useMutation({
		mutationFn: mutatation.patchSequence,
	});
	const { mutate: createLog } = useMutation({
		mutationFn: mutatation.postSessionLog,
	});

	const startDest = useMemo(
		() => generateStartDest(sequences?.[0].sequence),
		[sequences]
	);

	const goNextStep = useCallback(
		(log: SessionLogResult) => {
			if (step !== STEP_LIMIT) {
				setStep((prev) => prev + 1);
				setResultLogs((prev) => [...prev, log]);
			}
		},
		[step]
	);

	useEffect(() => {
		try {
			const parsed = JSON.parse(router.query.sequence as string);
			setSequences(Array(STEP_LIMIT).fill(parsed));
		} catch (error) {
			setSequences(null);
		}
	}, [router.query.sequence]);

	useEffect(() => {
		if (!sessionId) return;

		if (step === STEP_LIMIT) {
			publishMessage({
				uuid: sessionId as string,
				message: {
					type: 'complete',
					payload: null,
				},
			});

			updateSequnce({
				uuid: sessionId,
				sequence: sequences![0],
			});
		}
	}, [publishMessage, router, sequences, sessionId, step, updateSequnce]);

	useEffect(() => {
		if (successPublishing && successUpdatingSequence) {
			createLog(
				{ uuid: sessionId, data: resultLogs },
				{
					onSuccess: () => {
						router.push('/');
					},
				}
			);
		}
	}, [
		createLog,
		resultLogs,
		router,
		sessionId,
		successPublishing,
		successUpdatingSequence,
	]);

	if (!sequences || !sessionId) return null;

	return (
		<Fragment>
			{/* <pre>Device session: {sessionId}</pre> */}
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
