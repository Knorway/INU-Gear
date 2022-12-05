import { useQuery } from '@tanstack/react-query';
import { Fragment, useMemo } from 'react';

import Spinner from '~/src/components/Spinner';
import { useCtx } from '~/src/hooks/useCtx';

import { TabName, tabQueryKeyMapping, tapMapping } from './config/tab';
import { PageStateContext } from './context/PageContext';

const excluded: TabName[] = ['createToken'];

const TabComponent = () => {
	const pageState = useCtx(PageStateContext);

	const { isLoading } = useQuery({
		queryKey: tabQueryKeyMapping[pageState.currentTab],
	});

	const loading = useMemo(
		() => isLoading && !excluded.includes(pageState.currentTab),
		[isLoading, pageState.currentTab]
	);

	return (
		<Fragment>
			{loading && (
				<Fragment>
					<Spinner />
					<div className='absolute top-0 w-full h-full bg-white'></div>
				</Fragment>
			)}
			{tapMapping[pageState.currentTab].component}
		</Fragment>
	);
};

export default TabComponent;
