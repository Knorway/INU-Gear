import { useRouter } from 'next/router';
import { Fragment } from 'react';

import { checkExcludedUrl } from '~/src/utils';

import Header from './Header';

type Props = {
	children: React.ReactElement;
};

const excluded = ['device'];

const MainLayout = (props: Props) => {
	const router = useRouter();

	const allowedUrl = checkExcludedUrl(router.pathname, excluded);

	return (
		<Fragment>
			{allowedUrl && <Header />}
			{props.children}
		</Fragment>
	);
};

export default MainLayout;
