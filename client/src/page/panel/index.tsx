import { useRouter } from 'next/router';
import { Fragment, useEffect, useMemo, useState } from 'react';

import { BACKEND_URL } from '~/src/api/request';
import { MessageStream } from '~/src/config/settings';
import { useNotification } from '~/src/hooks/useNotification';
import PanelScreen from '~/src/page/panel/PanelScreen';

const PanelPage = () => {
	const [message, setMessage] = useState<MessageStream['payload'] | null>(null);
	const [completed, setCompleted] = useState(false);
	const [error, setError] = useState(false);

	const notConnected = useMemo(() => !message, [message]);

	const router = useRouter();
	const sessionId = router.query.sessionId as string;

	const { activateToast, toast } = useNotification();

	useEffect(() => {
		if (!sessionId) return;

		const eventSource = new EventSource(`${BACKEND_URL}/subscribe/${sessionId}`);

		eventSource.addEventListener('message', (e) => {
			const data = JSON.parse(e.data) as MessageStream;

			switch (data.type) {
				case 'message': {
					setMessage(data.payload);
					break;
				}
				case 'complete': {
					setCompleted(true);
					break;
				}
				case 'error': {
					setError(true);
					break;
				}
				default:
					break;
			}
		});

		eventSource.addEventListener('error', (e) => {
			console.log('eventSource error', e);
		});

		return () => {
			eventSource.close();
		};
	}, [sessionId]);

	useEffect(() => {
		if (!completed) return;

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
	}, [activateToast, completed, router]);

	useEffect(() => {
		if (error) {
			activateToast({
				variant: 'negative',
				title: '세션 저장에 실패했습니다.',
				description: '',
			});
		}
	}, [activateToast, error]);

	useEffect(() => {
		if (!message) return;
		console.log(`${Date.now() - message.timeStamp}ms`);
	}, [message]);

	if (notConnected) {
		return (
			<div className='flex flex-col items-center justify-center h-screen'>
				<div className='relative'>
					<span className='flex w-3 h-3'>
						<span className='absolute inline-flex w-full h-full bg-orange-400 rounded-full opacity-75 animate-ping'></span>
						<span className='relative inline-flex w-3 h-3 bg-orange-400 rounded-full'></span>
					</span>
				</div>
				<h1 className='text-center'>디바이스 연결을 기다리고 있습니다.</h1>
			</div>
		);
	}

	return (
		<Fragment>
			<div className="absolute bg-[url('/operation_background.png')] bg-no-repeat bg-cover w-full h-screen -z-10"></div>
			<div className='flex items-center justify-center h-[85vh]'>
				<PanelScreen message={message} />
			</div>
			{toast}
		</Fragment>
	);
};

export default PanelPage;
