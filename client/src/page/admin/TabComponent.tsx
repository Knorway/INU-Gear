import { Fragment } from 'react';

import { useCtx } from '~/src/hooks/useCtx';

import { tapMapping } from './config/tab';
import { PageStateContext } from './context/PageContext';

const TabComponent = () => {
	const pageState = useCtx(PageStateContext);

	return <Fragment>{tapMapping[pageState.currentTab].component}</Fragment>;
};

export default TabComponent;
