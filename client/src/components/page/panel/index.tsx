import { useRouter } from 'next/router';
import { Fragment, useEffect, useState } from 'react';

import { BACKEND_URL } from '~/src/api/request';
import PanelScreen from '~/src/components/page/panel/PanelScreen';
import { MessageStream } from '~/src/config/settings';

const PanelPage = () => {
	const [message, setMessage] = useState<MessageStream>();
	const router = useRouter();
	const sessionId = router.query.sessionId;

	useEffect(() => {
		if (!sessionId) return;

		const eventSource = new EventSource(`${BACKEND_URL}/subscribe/${sessionId}`);

		eventSource.addEventListener('message', (e) => {
			// if (e.data.type === 'connection')
			setMessage(JSON.parse(e.data));
		});

		eventSource.addEventListener('error', (e) => {
			console.log('error');
		});

		return () => {
			eventSource.close();
		};
	}, [sessionId]);

	useEffect(() => {
		if (!message) return;
		console.log(`${Date.now() - message.timeStamp}ms`);
	}, [message]);

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
		</Fragment>
	);
};

export default PanelPage;
