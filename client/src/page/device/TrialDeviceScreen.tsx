import { useCallback, useMemo } from 'react';

import { SEQUENCES } from '~/src/config/settings';
import useSequence from '~/src/hooks/useSequence';

import Char from './Char';

type Props = {
	targetSequence: typeof SEQUENCES[number];
	startDest: any[];
	trigger: () => void;
};

const TrialDeviceScreen = ({ startDest, targetSequence, trigger }: Props) => {
	const { cursor, sequence } = useSequence({
		targetSequence,
		startDest,
		trialDelay: 32,
		isTrial: true,
	});

	const { current: currentCursor } = cursor;
	const { chars, direction } = sequence;

	const isLeft = useMemo(() => direction === 'LEFT', [direction]);

	const tint = useCallback(
		(idx: number) => {
			if (idx === currentCursor) return 'rgb(250 204 21)';
			return 'black';
		},
		[currentCursor]
	);

	return (
		<div className='overflow-hidden'>
			<button onClick={trigger} className='absolute'>
				trigger
			</button>
			<div
				className={`inline-flex items-center justify-center h-screen w-screen
				${isLeft ? 'rotate-90' : ''} 
				`}
			>
				<div
					className={`flex text-9xl select-none ${
						isLeft ? 'flex-col space-y-8' : 'flex-row space-x-8'
					} `}
				>
					{chars.map((char, idx) => (
						<Char key={char} char={char} tint={tint(idx)} />
					))}
				</div>
			</div>
		</div>
	);
};

export default TrialDeviceScreen;
