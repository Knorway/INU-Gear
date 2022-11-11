import { useRouter } from 'next/router';
import { Fragment, useEffect, useState } from 'react';

import { useQuery } from '@tanstack/react-query';

import { getSessionToken } from '../../../api/fetcher';

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
		if (!sessionToken) return;

		const eventSource = new EventSource(
			// `http://localhost:8090/subscribe/${sessionToken}`
			`http://172.30.1.33:8090/subscribe/${sessionToken.uuid}`
		);
		eventSource.addEventListener('message', (e) => {
			console.log(`${Date.now() - JSON.parse(e.data).timeStamp}ms`);
			setData((prev: any) => [
				...prev,
				`${Date.now() - JSON.parse(e.data).timeStamp}ms`,
			]);
		});
		eventSource.addEventListener('error', (e) => {
			console.log('error');
		});

		return () => {
			eventSource.close();
		};
	}, [sessionToken]);

	return (
		<Fragment>
			<pre>Device session: {sessionToken?.uuid}</pre>
			<pre>{JSON.stringify(data, null, 2)}</pre>
		</Fragment>
	);
};

export default DevicePage;
