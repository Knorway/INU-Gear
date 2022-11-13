import _ from 'lodash';
import dynamic from 'next/dynamic';
import { useCallback, useMemo, useState } from 'react';

import { NUM_PHASE, NUM_STEP, SEQUENCES } from '~/src/config/settings';

const ControlPanel = dynamic(() => import('~/src/components/page/ControlPanel'), {
	ssr: false,
});

const SessionPage = () => {
	const [sessionSequences, setSessionSequences] = useState(_.shuffle(SEQUENCES));
	const [phase, setPhase] = useState(1);
	const [step, setStep] = useState(0);
	const [start, setStart] = useState(false);

	const endSession = useMemo(
		() => phase === NUM_PHASE && step === NUM_STEP,
		[phase, step]
	);

	const goNextPhase = useCallback(() => {
		if (phase >= NUM_PHASE) return;
		setPhase((prev) => prev + 1);
		setStep(0);
		setSessionSequences(_.shuffle(SEQUENCES));
	}, [phase]);

	const goNextStep = useCallback(() => {
		if (step < NUM_STEP) {
			return setStep((prev) => prev + 1);
		}
		goNextPhase();
	}, [goNextPhase, step]);

	if (!start) return <button onClick={() => setStart(true)}>start</button>;

	return (
		<div
			style={{
				margin: '0 auto',
				display: 'flex',
				flexDirection: 'column',
				maxWidth: '600px',
				userSelect: 'none',
			}}
		>
			{/* <input type='number' defaultValue={DEFAULT_DELAY} />
			<div>set sensitivity</div> */}
			{/* <div>
				<button onClick={goNextStep}>next</button>
			</div> */}
			<p>current phase: {phase}</p>
			<p>current step: {step + 1}</p>
			{sessionSequences.map((sequence, idx) => {
				if (step === idx) {
					return (
						<ControlPanel
							key={idx}
							targetSequence={sequence}
							onFinish={goNextStep}
							endSession={endSession}
						/>
					);
				}
			})}
		</div>
	);
};

export default SessionPage;
