import { useMemo } from 'react';

import { MessageStream, optrTable } from '~/src/config/settings';

type Props = {
	message: MessageStream['payload'];
};

const PanelScreen = ({ message }: Props) => {
	const { cursor, isFinished, isOperational } = message!;
	const { starting, destination } = cursor;

	const operationText = useMemo(() => {
		if (isOperational) {
			return `(${optrTable[destination]}[${destination}]) 상태로 변속하세요.`;
		}
		return `현재 (${optrTable[starting]}[${starting}]) 상태입니다.`;
	}, [destination, isOperational, starting]);

	return (
		<div className='w-full'>
			<div className='flex-1'>
				<div
					style={{
						fontSize: '40px',
						border: '1px solid black',
						textAlign: 'center',
					}}
				>
					{isFinished ? (
						<h1
							style={{
								visibility: isFinished ? 'visible' : 'hidden',
								fontSize: '40px',
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
