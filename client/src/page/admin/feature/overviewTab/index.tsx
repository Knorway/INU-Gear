import { useQuery } from '@tanstack/react-query';
import { Fragment } from 'react';

import { query } from '~/src/api/fetcher';
import { queryKey } from '~/src/api/queryClient';
import Spinner from '~/src/components/Spinner';

const OverViewTab = () => {
	const { data, isLoading } = useQuery({
		queryKey: queryKey.sessionTokens,
		queryFn: () => query.getSessionTokens(),
	});

	// const { data } = useQuery({
	// 	queryKey: queryKey.aggregateSequence,
	// 	queryFn: () => {
	// 		return query.getOverviewAggregate({ sequence: ['D', 'N', 'R'] });
	// 	},
	// });

	if (!data) return null;

	return (
		<Fragment>
			{isLoading && <Spinner />}
			<div>생성된 참가자 세션: {data?.tokens?.length}</div>
		</Fragment>
	);
};

export default OverViewTab;
