import { useQueryClient } from '@tanstack/react-query';
import { Fragment } from 'react';

import Spinner from '~/src/components/Spinner';
import { useCtx } from '~/src/hooks/useCtx';

import { TabName, tabQueryKeyMapping, tapMapping } from './config/tab';
import { PageStateContext } from './context/PageContext';

const excluded: TabName[] = ['createToken'];

const TabComponent = () => {
	const pageState = useCtx(PageStateContext);
	const queryClient = useQueryClient();
	const isTabLoading = queryClient.getQueriesData(
		tabQueryKeyMapping[pageState.currentTab]
	)[1];

	if (isTabLoading && !excluded.includes(pageState.currentTab)) return <Spinner />;

	return <Fragment>{tapMapping[pageState.currentTab].component}</Fragment>;
};

export default TabComponent;
