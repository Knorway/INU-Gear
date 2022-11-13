import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import { Fragment, useEffect, useState } from 'react';

import { getSessionToken } from '~/src/api/fetcher';
import { BACKEND_URL } from '~/src/api/request';

const DevicePage = () => {
	const [data, setData] = useState<any>([]);
	const router = useRouter();
	const sessionId = router.query.sessionId;

	const { data: sessionToken } = useQuery({
		queryKey: ['sessionToken', sessionId],
		queryFn: () => getSessionToken({ uuid: sessionId as string }),
		enabled: Boolean(sessionId),
	});

	useEffect(() => {
		// if (!sessionToken) return;
		if (!sessionId) return;

		const eventSource = new EventSource(`${BACKEND_URL}/subscribe/${sessionId}`);

		eventSource.addEventListener('message', (e) => {
			const timeStampPre = JSON.parse(e.data).timeStamp;
			const timeStampPost = Date.now();
			setData((prev: any) => [...prev, `${timeStampPost - timeStampPre}ms`]);
		});

		eventSource.addEventListener('error', (e) => {
			console.log('error');
		});

		return () => {
			eventSource.close();
		};
	}, [sessionId]);

	return (
		<Fragment>
			<pre>Device session: {sessionToken?.uuid}</pre>
			<pre>{JSON.stringify(data, null, 2)}</pre>
		</Fragment>
	);
};

export default DevicePage;
