import { useRouter } from 'next/router';

import { SessionToken } from '~/src/api/fetcher';
import { filterCandidates } from '~/src/utils';

const Page = () => {
	const router = useRouter();

	const sessionToken = JSON.parse(
		(router.query.sequence || '{}') as string
	) as SessionToken;
	console.log(sessionToken);
	// console.log(filterCandidates(sessionToken.sequence));

	return (
		<div>
			<pre>{router.query.token}</pre>
			<pre>{router.query.sequence}</pre>
		</div>
	);
};

export default Page;
