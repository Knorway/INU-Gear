import _ from 'lodash';
import dynamic from 'next/dynamic';
import { useCallback, useState } from 'react';

import {
  DEFAULT_DELAY,
  NUM_PHASE,
  NUM_STEP,
  SEQUENCES,
} from '../../config/settings';

const ControlPanel = dynamic(() => import('../ControlPanel'), {
	ssr: false,
});

// reducer for global context & setting
// useSequence, useSetting, useSession, ...

// type Log = {
// 	sequence: typeof SEQUENCES[number][]
// }

const SessionPage = () => {
	const [sessionSequences, setSessionSequences] = useState(_.shuffle(SEQUENCES));
	const [phase, setPhase] = useState(1);
	const [step, setStep] = useState(0);

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

	// useEffect(() => {
	// 	if (phase === NUM_PHASE && step === NUM_STEP + 1) {
	// 		alert('session completed');
	// 	}
	// }, [phase, step]);

	return (
		<div
			style={{
				margin: '0 auto',
				display: 'flex',
				flexDirection: 'column',
				width: '300px',
				userSelect: 'none',
			}}
		>
			<input type='number' defaultValue={DEFAULT_DELAY} />
			<div>set sensitivity</div>
			<div>
				<button onClick={goNextStep}>next</button>
			</div>
			<p>current phase: {phase}</p>
			<p>current step: {step + 1}</p>
			{sessionSequences.map((sequence, idx) => {
				if (step === idx) {
					return (
						<ControlPanel
							key={idx}
							targetSequence={sequence}
							onFinish={goNextStep}
						/>
					);
				}
			})}
		</div>
	);
};

export default SessionPage;
