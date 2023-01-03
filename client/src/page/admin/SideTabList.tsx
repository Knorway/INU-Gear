import { Fragment, useCallback } from 'react';

import { useCtx } from '~/src/hooks/useCtx';

import { tabList, tabMapping, TabName } from './config/tab';
import { PageDispatchContext, PageStateContext } from './context/PageContext';

const SideTabList = () => {
	const pageState = useCtx(PageStateContext);
	const dispatch = useCtx(PageDispatchContext);

	const switchTab = useCallback(
		(tabName: TabName) => () => {
			dispatch({ currentTab: tabName });
		},
		[dispatch]
	);

	const isCurrentTab = useCallback(
		(tabName: TabName) => {
			return tabName === pageState.currentTab;
		},
		[pageState.currentTab]
	);

	return (
		<Fragment>
			{tabList.map((tabName) => (
				<div
					key={tabName}
					onClick={switchTab(tabName)}
					className={`${
						isCurrentTab(tabName) ? 'font-normal' : 'font-thin'
					} cursor-pointer min-w-max`}
				>
					{tabMapping[tabName].label}
				</div>
			))}
		</Fragment>
	);
};

export default SideTabList;
