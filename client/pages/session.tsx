import axios from 'axios';
import dynamic from 'next/dynamic';
import { Fragment, useEffect, useRef } from 'react';

const SessionPage = dynamic(() => import('../src/components/page/SessionPage'), {
	ssr: false,
});

const Page = () => {
	return (
		<Fragment>
			<SessionPage />
		</Fragment>
	);
};

export default Page;
