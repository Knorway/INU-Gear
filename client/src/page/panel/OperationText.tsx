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
						<span className='text-blue-600'>{optrTable[starting]}</span>
					</div>
				</div>
				<div className='flex-row'>
					<div className='px-16 py-2 leading-none border-b-2 border-black text-[44px]'>
						목표 위치
					</div>
					<div className='py-5'>
						<span className='text-red-600'>{optrTable[destination]}</span>
					</div>
				</div>
			</div>
		</div>
	);
};

export default OperationText;
