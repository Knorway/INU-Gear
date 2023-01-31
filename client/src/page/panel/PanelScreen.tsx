import { Fragment, useMemo } from 'react';

import { MessageStream, optrTable } from '~/src/config/settings';

type Props = {
	message: MessageStream['payload'];
};

const PanelScreen = ({ message }: Props) => {
	const { cursor, isOperational } = message!;
	const { starting, destination } = cursor;

	const operationText = useMemo(() => {
		if (!isOperational) {
			return null;
		}

		return (
			<Fragment>
				{
					<span className='text-blue-700'>
						{optrTable[starting]}[{starting}]
					</span>
				}
				{' -> '}
				{
					<span className='text-red-700'>
						{optrTable[destination]}[{destination}]
					</span>
				}
			</Fragment>
		);
	}, [destination, isOperational, starting]);

	return (
		<div className='w-full'>
			<div className='flex-1'>
				<div className='text-[84px] font-bold text-center'>{operationText}</div>
			</div>
		</div>
	);
};

export default PanelScreen;
