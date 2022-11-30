import { useRouter } from 'next/router';
import { Fragment, useEffect, useMemo, useState } from 'react';

import { BACKEND_URL } from '~/src/api/request';
import Toast from '~/src/components/Toast';
import { MessageStream } from '~/src/config/settings';
import { useNotification } from '~/src/hooks/useNotification';
import PanelScreen from '~/src/page/panel/PanelScreen';

import EnteringCountDown from './EnteringCountDown';

const PanelPage = () => {
	const [message, setMessage] = useState<MessageStream['payload'] | null>(null);
	const [initialized, setInitialized] = useState(false);
	const [completed, setCompleted] = useState(false);

	const firstEntering = useMemo(() => initialized && !message, [initialized, message]);

	const router = useRouter();
	const sessionId = router.query.sessionId as string;

	const { isActive, activate } = useNotification();

	useEffect(() => {
		if (!sessionId) return;

		const eventSource = new EventSource(
			`${BACKEND_URL ?? ''}/subscribe/${sessionId}`
		);

		eventSource.addEventListener('message', (e) => {
			const data = JSON.parse(e.data) as MessageStream;

			switch (data.type) {
				case 'initialize': {
					setInitialized(true);
					break;
				}
				case 'message': {
					setInitialized(false);
					setMessage(data.payload);
					break;
				}
				case 'complete': {
					setCompleted(true);
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

		activate();
		const id = setTimeout(() => {
			router.push('/');
		}, 3500);

		return () => {
			clearTimeout(id);
		};
	}, [activate, completed, router]);

	useEffect(() => {
		if (!message) return;
		console.log(`${Date.now() - message.timeStamp}ms`);
	}, [message]);

	if (firstEntering) return <EnteringCountDown />;

	if (!message) {
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
			<h1>Panel sessionId: {router.query.sessionId}</h1>
			<pre>{JSON.stringify(message, null, 2)}</pre>
			<PanelScreen message={message} />
			{isActive && (
				<Toast
					variant='positive'
					title='세션이 종료되었습니다'
					description='잠시후 메인 화면으로 되돌아갑니다'
				/>
			)}
		</Fragment>
	);
};

export default PanelPage;
