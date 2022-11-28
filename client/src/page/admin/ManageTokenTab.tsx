import { useQuery } from '@tanstack/react-query';
import { Fragment } from 'react';

import { getSessionTokens } from '~/src/api/fetcher';
import Spinner from '~/src/components/notifier/Spinner';

const ManageTokenTab = () => {
	const { data: sessionTokens, isLoading } = useQuery({
		queryKey: ['sessionTokens'],
		queryFn: getSessionTokens,
	});

	if (!sessionTokens) return null;

	return (
		<Fragment>
			{isLoading && <Spinner />}
			<div className='flex-col space-y-3'>
				{sessionTokens.map((e) => (
					<div key={e.uuid}>{`${e.label} | ${e.uuid}`}</div>
				))}
			</div>
		</Fragment>
	);
};

export default ManageTokenTab;
