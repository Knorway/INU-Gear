import { Cog6ToothIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/router';
import { Fragment } from 'react';

const Header = () => {
	const router = useRouter();

	return (
		<Fragment>
			<nav className='flex items-center justify-between px-4 py-2 border-b bg-gray-50'>
				<div>
					<img
						src='/logo.png'
						alt='logo'
						onClick={() => router.push('/')}
						className='cursor-pointer'
					/>
				</div>
				{/* <div
					style={{
						position: 'absolute',
						left: '50%',
						transform: 'translateX(-50%)',
						padding: 8,
						border: '2px solid black',
						color: 'crimson',
						fontWeight: 'bold',
						fontSize: 18,
					}}
				>
					DEBUG MODE
				</div> */}
				<div>
					<Cog6ToothIcon
						className='w-6 h-6 cursor-pointer'
						onClick={() => router.push('/admin')}
					/>
				</div>
			</nav>
		</Fragment>
	);
};

export default Header;
