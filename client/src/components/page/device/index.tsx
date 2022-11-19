import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import { Fragment, useCallback, useEffect, useMemo, useState } from 'react';

import { postMessageStream } from '~/src/api/fetcher';
import DeviceScreen from '~/src/components/page/device/DeviceScreen';
import { ParamOf, SEQUENCES } from '~/src/config/settings';
import { generateStartDest } from '~/src/utils';

const STEP_LIMIT = 6;

const DevicePage = () => {
	const [sequences, setSequences] = useState<typeof SEQUENCES[number][] | null>(null);
	const [step, setStep] = useState(0);

	const router = useRouter();
	const sessionId = router.query.sessionId;

	const { mutate: publishMessage } = useMutation({
		mutationFn: (param: ParamOf<typeof postMessageStream>) =>
			postMessageStream(param),
	});

	const startDest = useMemo(
		() => generateStartDest(sequences?.[0].sequence),
		[sequences]
	);

	// console.log(sequences);
	// console.log(startDest);

	const goNextStep = useCallback(() => {
		if (step !== STEP_LIMIT) {
			return setStep((prev) => prev + 1);
		}
	}, [step]);

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
			router.push('/');
		}
	}, [publishMessage, router, sessionId, step]);

	if (!sequences || !sessionId) return null;

	return (
		<Fragment>
			<pre>Device session: {sessionId}</pre>
			{sequences.map((sequence, idx) => {
				if (step === idx) {
					return (
						<DeviceScreen
							key={idx}
							targetSequence={sequence}
							// startDest={startDest.slice(step, step + 1).flatMap((e) => e)}
							startDest={startDest[step]}
							sessionId={sessionId as string}
							onFinish={goNextStep}
						/>
					);
				}
			})}
		</Fragment>
	);
};

export default DevicePage;
