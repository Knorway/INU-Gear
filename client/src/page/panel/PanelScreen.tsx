import { useRouter } from 'next/router';
import { Fragment, useEffect, useMemo } from 'react';

import { MessageStream, optrTable } from '~/src/config/settings';
import { useNotification } from '~/src/hooks/useNotification';

type Props = {
	message: MessageStream;
};

const PanelScreen = ({ message }: Props) => {
	const { cursor, isOperational } = message.message!;
	const { starting, destination } = cursor;

	const router = useRouter();
	const { activateToast, toast } = useNotification();

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

	useEffect(() => {
		if (!message.complete) return;

		activateToast({
			variant: 'positive',
			title: '세션이 종료되었습니다',
			description: '잠시후 메인 화면으로 되돌아갑니다',
		});
		const id = setTimeout(() => {
			router.push('/');
		}, 3500);

		return () => {
			clearTimeout(id);
		};
	}, [activateToast, message.complete, router]);

	useEffect(() => {
		if (message.error) {
			activateToast({
				variant: 'negative',
				title: '세션 저장에 실패했습니다.',
				description: '',
			});
		}
	}, [activateToast, message.error]);

	useEffect(() => {
		if (!message.message) return;
		console.log(`${Date.now() - message.message.timeStamp}ms`);
	}, [message]);

	return (
		<Fragment>
			<div className='w-full'>
				<div className='flex-1'>
					<div className='text-[84px] font-bold text-center'>
						{operationText}
					</div>
				</div>
			</div>
			{toast}
		</Fragment>
	);
};

export default PanelScreen;
