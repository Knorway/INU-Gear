import Link from 'next/link';
import { Fragment } from 'react';

const Page = () => {
	return (
		<Fragment>
			<div className='m-auto space-x-4 text-center text-blue-500 underline'>
				<Link href={'/session'}>session</Link>
				<Link href={'/admin'}>admin</Link>
			</div>
			<h1 className='text-4xl font-bold text-center'>Gear</h1>
		</Fragment>
	);
};

export default Page;
