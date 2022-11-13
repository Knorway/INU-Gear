import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useRouter } from 'next/router';
import { Fragment, useCallback } from 'react';

import { getSessionToken } from '~/src/api/fetcher';
import { BACKEND_URL } from '~/src/api/request';

const PanelPage = () => {
	const router = useRouter();
	const sessionId = router.query.sessionId;

	const { data: sessionToken } = useQuery({
		queryKey: ['sessionToken', sessionId],
		queryFn: () => getSessionToken({ uuid: sessionId as string }),
		enabled: Boolean(sessionId),
	});

	const publish = useCallback(() => {
		// if (!sessionToken) return;
		if (!sessionId) return;

		axios.post(`${BACKEND_URL}/publish/${sessionId}`, {
			timeStamp: Date.now(),
		});
	}, [sessionId]);

	return (
		<Fragment>
			<button onClick={publish}>publish</button>
			<h1>Panel sessionId: {router.query.sessionId}</h1>
			<pre>{JSON.stringify(sessionToken, null, 2)}</pre>
		</Fragment>
	);
};

export default PanelPage;
