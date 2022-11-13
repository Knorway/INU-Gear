import Link from 'next/link';
import { Fragment } from 'react';

import SessionTokenListBox from '~/src/components/page/main/SessionIdListBox';

const MainPage = () => {
	return (
		<Fragment>
			<div className='flex flex-col items-center justify-center'>
				<div className='space-x-4 text-blue-500 underline'>
					<Link href={'/session'}>session</Link>
					<Link href={'/admin'}>admin</Link>
				</div>
				<h1 className='text-4xl font-bold'>Gear</h1>
				<SessionTokenListBox />
			</div>
		</Fragment>
	);
};

export default MainPage;
