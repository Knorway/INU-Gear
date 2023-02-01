import { useRouter } from 'next/router';
import { Fragment, useEffect } from 'react';

import { useCtx } from '~/src/hooks/useCtx';
import { useNotification } from '~/src/hooks/useNotification';

import { PageStateContext } from './context/PageContext';
import OperationText from './OperationText';

const PanelScreen = () => {
	const pageState = useCtx(PageStateContext);

	const router = useRouter();
	const { activateToast, toast } = useNotification();

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
					<OperationText />
				</div>
			</div>
			{toast}
		</Fragment>
	);
};

export default PanelScreen;
