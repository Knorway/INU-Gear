import { useQuery } from '@tanstack/react-query';
import { Fragment } from 'react';

import { getSessionTokens, getSimpleSequnceAgg } from '~/src/api/fetcher';

const OverViewTab = () => {
	const { data: sessionTokens, isLoading } = useQuery({
		queryKey: ['sessionTokens'],
		queryFn: getSessionTokens,
	});

	const { data } = useQuery({
		queryKey: ['aggregate', 'sequence'],
		queryFn: () => {
			return getSimpleSequnceAgg({ sequence: ['D', 'N', 'R'] });
		},
	});

	console.log(data);

	if (!sessionTokens) return null;

	return (
		<Fragment>
			<div>생성된 참가자 세션: {sessionTokens.length}</div>
		</Fragment>
	);
};

export default OverViewTab;
