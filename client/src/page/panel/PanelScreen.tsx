import { Fragment, useMemo } from 'react';

import { MessageStream, optrTable } from '~/src/config/settings';

type Props = {
	message: MessageStream['payload'];
};

const PanelScreen = ({ message }: Props) => {
	const { cursor, isFinished, isOperational } = message!;
	const { starting, destination } = cursor;

	const operationText = useMemo(() => {
		if (isOperational) {
			return (
				<Fragment>
					{
						<span className='text-red-700'>
							{optrTable[destination]}[{destination}]
						</span>
					}{' '}
					상태로 변속하세요.
				</Fragment>
			);
		}

		return (
			<Fragment>
				현재{' '}
				{
					<span className='text-blue-700'>
						{optrTable[starting]}[{starting}]
					</span>
				}{' '}
				상태입니다.
			</Fragment>
		);
	}, [destination, isOperational, starting]);

	return (
		<div className='w-full'>
			<div className='flex-1'>
				<div
					style={{
						fontSize: '84px',
						fontWeight: 'bold',
						textAlign: 'center',
					}}
				>
					{isFinished ? (
						<h1
							style={{
								visibility: isFinished ? 'visible' : 'hidden',
								fontSize: '84px',
								fontWeight: 'bold',
								color: 'green',
							}}
						>
							PASS
						</h1>
					) : (
						operationText
					)}
				</div>
			</div>
		</div>
	);
};

export default PanelScreen;
