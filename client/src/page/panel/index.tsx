import { useRouter } from 'next/router';
import { Fragment, useEffect, useMemo, useState } from 'react';

import { BACKEND_URL } from '~/src/api/request';
import { MessageStream } from '~/src/config/settings';
import PanelScreen from '~/src/page/panel/PanelScreen';

const PanelPage = () => {
	const [message, setMessage] = useState<MessageStream>({
		complete: false,
		error: false,
		message: null,
	});

	const router = useRouter();
	const sessionId = router.query.sessionId as string;

	const notConnected = useMemo(() => !message.message, [message]);

	useEffect(() => {
		if (!sessionId) return;

		const eventSource = new EventSource(`${BACKEND_URL}/subscribe/${sessionId}`);

		eventSource.addEventListener('message', (e) => {
			const data = JSON.parse(e.data) as MessageStream;
			setMessage((prev) => ({ ...prev, ...data }));
		});
		eventSource.addEventListener('error', (e) => {
			console.log('eventSource error', e);
		});

		return () => {
			eventSource.close();
		};
	}, [sessionId]);

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
			<div className='w-full h-screen overflow-hidden'>
				<img src='/operation_background.png' alt='bg' className='w-full h-full' />
			</div>
			<div className='flex items-center justify-center h-[100vh] absolute top-0 left-1/2 -translate-x-1/2'>
				<PanelScreen message={message} />
			</div>
		</Fragment>
	);
};

export default PanelPage;
