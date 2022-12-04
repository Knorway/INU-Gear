import { useQuery } from '@tanstack/react-query';
import { Fragment } from 'react';

import { query } from '~/src/api/fetcher';
import Spinner from '~/src/components/Spinner';

const OverViewTab = () => {
	const { data: sessionTokens, isLoading } = useQuery({
		queryKey: ['sessionTokens'],
		queryFn: query.getSessionTokens,
	});

	const { data } = useQuery({
		queryKey: ['aggregate', 'sequence'],
		queryFn: () => {
			return query.getOverviewAggregate({ sequence: ['D', 'N', 'R'] });
		},
	});

	console.log(data);

	if (!sessionTokens) return null;

	return (
		<Fragment>
			{isLoading && <Spinner />}
			<div>생성된 참가자 세션: {sessionTokens.length}</div>
		</Fragment>
	);
};

export default OverViewTab;
