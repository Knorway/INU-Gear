import { MessageStream, optrTable } from '~/src/config/settings';

type Props = {
	message: MessageStream;
};

const PanelScreen = ({ message }: Props) => {
	const { cursor, isFinished, isOperational } = message;
	const { starting, destination } = cursor;
	return (
		<div>
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
						optrTable[starting]
					)}
					{!isFinished && ' -> '}
					{isOperational && optrTable[destination]}
				</div>
			</div>
		</div>
	);
};

export default PanelScreen;
