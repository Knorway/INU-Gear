import { optrTable } from '~/src/config/settings';
import { useCtx } from '~/src/hooks/useCtx';

import { PageStateContext } from './context/PageContext';

const OperationText = () => {
	const pageState = useCtx(PageStateContext);
	const { cursor, isOperational } = pageState.message!;
	const { starting, destination } = cursor;

	if (!isOperational) {
		return null;
	}

	return (
		<div className='text-[48px] text-center font-bold'>
			<div className='relative flex bg-white border-2 border-black'>
				<div className='flex-row'>
					<div className='px-16 py-2 leading-none border-b-2 border-r-2 border-black text-[44px]'>
						현재 위치
					</div>
					<div className='py-5 border-r-2 border-black'>
						<span>
							<span className='font-bold text-blue-600'>{starting}</span> [
							<span className='text-blue-600'>{optrTable[starting]}</span>]
						</span>
					</div>
				</div>
				<div
					className='absolute -translate-x-[43%] translate-y-[5%] top-1/2 left-1/2'
					style={{ margin: 0 }}
				>
					<svg
						xmlns='http://www.w3.org/2000/svg'
						fill='none'
						viewBox='0 0 24 24'
						strokeWidth={4}
						stroke='currentColor'
						className='w-16 h-16'
					>
						<path
							strokeLinecap='round'
							strokeLinejoin='round'
							d='M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3'
						/>
					</svg>
				</div>
				<div className='flex-row'>
					<div className='px-16 py-2 leading-none border-b-2 border-black text-[44px]'>
						목표 위치
					</div>
					<div className='py-5'>
						<span>
							<span className='font-bold text-red-600 '>{destination}</span>{' '}
							[
							<span className='text-red-600'>{optrTable[destination]}</span>
							]
						</span>
					</div>
				</div>
			</div>
		</div>
	);
};

export default OperationText;
