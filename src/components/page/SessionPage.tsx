import _, { Function } from 'lodash';
import dynamic from 'next/dynamic';
import React, { createContext, useCallback, useMemo, useState } from 'react';

import {
  DEFAULT_DELAY,
  NUM_PHASE,
  NUM_STEP,
  ResultData,
  SEQUENCES,
} from '../../config/settings';

const ControlPanel = dynamic(() => import('../ControlPanel'), {
	ssr: false,
});

const SessionPage = () => {
	const [sessionSequences, setSessionSequences] = useState(_.shuffle(SEQUENCES));
	const [phase, setPhase] = useState(1);
	const [step, setStep] = useState(0);

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
