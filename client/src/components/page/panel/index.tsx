import axios from 'axios';
import { useRouter } from 'next/router';
import { Fragment, useCallback } from 'react';

import { useQuery } from '@tanstack/react-query';

import { getSessionToken } from '../../../api/fetcher';

const PanelPage = () => {
	const router = useRouter();
	const sessionId = router.query.sessionId;

	const { data: sessionToken } = useQuery({
		queryKey: ['sessionToken', sessionId],
		queryFn: () => getSessionToken({ uuid: sessionId as string }),
		enabled: Boolean(sessionId),
	});

	const publish = useCallback(() => {
		if (!sessionToken) return;
		// axios.post(`http://localhost:8090/publish/${sessionToken}`, {
		axios.post(`http://172.30.1.33:8090/publish/${sessionToken.uuid}`, {
			timeStamp: Date.now(),
		});
	}, [sessionToken]);

	return (
		<Fragment>
			<button onClick={publish}>publish</button>
			<h1>Panel sessionId: {router.query.sessionId}</h1>
			<pre>{JSON.stringify(sessionToken, null, 2)}</pre>
		</Fragment>
	);
};

export default PanelPage;
