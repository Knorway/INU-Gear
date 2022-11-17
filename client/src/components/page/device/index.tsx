import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import { Fragment, useCallback, useMemo, useState } from 'react';

import { getSessionToken } from '~/src/api/fetcher';
import DeviceScreen from '~/src/components/page/device/DeviceScreen';
import { NUM_PHASE, NUM_STEP } from '~/src/config/settings';

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
			<pre>Device session: {sessionToken.uuid}</pre>
			{sessionToken.sequence.map((sequence, idx) => {
				if (step === idx) {
					return (
						<DeviceScreen
							key={idx}
							targetSequence={sequence}
							onFinish={goNextStep}
							endSession={endSession}
							sessionId={sessionToken.uuid}
						/>
					);
				}
			})}
		</Fragment>
	);
};

export default DevicePage;
