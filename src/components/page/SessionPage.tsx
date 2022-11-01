import _ from 'lodash';
import dynamic from 'next/dynamic';
import { useCallback, useMemo, useState } from 'react';

import { DEFAULT_DELAY, SEQUENCES } from '../../util/config';

const ControlPanel = dynamic(() => import('../ControlPanel'), {
	ssr: false,
});

const SessionPage = () => {
	const [step, setStep] = useState(0);
	// const [pending, setPending] = useState(true);

	const sessionSequence = useMemo(() => _.shuffle(SEQUENCES), []);

	const stepAhead = useCallback(() => {
		if (step < SEQUENCES.length - 1) {
			setStep((prev) => prev + 1);
		}
	}, [step]);

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
				<button onClick={stepAhead}>next</button>
			</div>
			<p>current step: {step + 1}</p>
			{sessionSequence.map((e, idx) => {
				if (step === idx) {
					return <ControlPanel key={idx} sequence={e} onFinish={stepAhead} />;
				}
			})}
		</div>
	);
};

export default SessionPage;
