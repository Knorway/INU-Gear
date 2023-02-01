import { useRouter } from 'next/router';
import { Fragment, useEffect, useMemo } from 'react';

import { optrTable } from '~/src/config/settings';
import { useCtx } from '~/src/hooks/useCtx';
import { useNotification } from '~/src/hooks/useNotification';

import { PageStateContext } from './context/PageContext';

const PanelScreen = () => {
	const pageState = useCtx(PageStateContext);
	const { cursor, isOperational } = pageState.message!;
	const { starting, destination } = cursor;

	const router = useRouter();
	const { activateToast, toast } = useNotification();

	const operationText = useMemo(() => {
		if (!isOperational) {
			return null;
		}

		return (
			<Fragment>
				<div className='relative flex bg-white border-2 border-black'>
					<div className='flex-row'>
						<div className='px-16 py-2 border-b-2 border-r-2 border-black'>
							현재 위치
						</div>
						<div className='py-2 border-r-2 border-black'>
							<span>
								<span className='font-bold text-blue-600'>
									{starting}
								</span>{' '}
								[
								<span className='text-blue-600'>
									{optrTable[starting]}
								</span>
								]
							</span>
						</div>
					</div>
					<div
						className='absolute -translate-x-1/2 translate-y-[20%] top-1/2 left-1/2'
						style={{ margin: 0 }}
					>
						<svg
							xmlns='http://www.w3.org/2000/svg'
							fill='none'
							viewBox='0 0 24 24'
							strokeWidth={3}
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
						<div className='px-16 py-2 border-b-2 border-black'>
							목표 위치
						</div>
						<div className='py-2'>
							<span>
								<span className='font-bold text-red-600 '>
									{destination}
								</span>{' '}
								[
								<span className='text-red-600'>
									{optrTable[destination]}
								</span>
								]
							</span>
						</div>
					</div>
				</div>
			</Fragment>
		);
	}, [destination, isOperational, starting]);

	useEffect(() => {
		if (!pageState.complete) return;

		activateToast({
			variant: 'positive',
			title: '세션이 종료되었습니다',
			description: '잠시후 메인 화면으로 되돌아갑니다',
		});
		const id = setTimeout(() => {
			router.push('/');
		}, 3500);

		return () => {
			clearTimeout(id);
		};
	}, [activateToast, pageState.complete, router]);

	useEffect(() => {
		if (pageState.error) {
			activateToast({
				variant: 'negative',
				title: '세션 저장에 실패했습니다.',
				description: '',
			});
		}
	}, [activateToast, pageState.error]);

	useEffect(() => {
		if (!pageState.message) return;
		console.log(`${Date.now() - pageState.message.timeStamp}ms`);
	}, [pageState.message]);

	return (
		<Fragment>
			<div className='w-full'>
				<div className='flex-1'>
					<div className='text-[48px] text-center'>{operationText}</div>
				</div>
			</div>
			{toast}
		</Fragment>
	);
};

export default PanelScreen;
