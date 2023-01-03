import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { Fragment } from 'react';
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';

import { mutatation } from '~/src/api/fetcher';
import FormInput from '~/src/components/FormInput';
import Spinner from '~/src/components/Spinner';
import Toast from '~/src/components/Toast';
import { useNotification } from '~/src/hooks/useNotification';

type FormType = {
	label: string;
};

const TokenRegisterTab = () => {
	const formMethods = useForm<FormType>();
	const { activateToast, toast } = useNotification();

	const {
		mutate: registerSessionToken,
		data,
		isLoading,
	} = useMutation({
		mutationFn: mutatation.postSessionToken,
	});

	const registerToken: SubmitHandler<FormType> = async (data) => {
		registerSessionToken(
			{ label: data.label },
			{
				onSuccess: () => {
					formMethods.reset();
					activateToast({
						variant: 'positive',
						title: '유저 세션을 생성했습니다',
						description: '',
					});
				},
				onError: (error) => {
					console.log(error);
					activateToast({
						variant: 'negative',
						title: '참가자 생성에 실패했습니다.',
						description:
							(error as AxiosError<any>).response?.data?.error ??
							'unknown error',
					});
				},
			}
		);
	};

	return (
		<Fragment>
			{isLoading && <Spinner />}
			<FormProvider {...formMethods}>
				<form
					onSubmit={formMethods.handleSubmit(registerToken)}
					className='flex-row space-y-4'
				>
					<h1 className='text-3xl font-bold'>참가자 등록하기</h1>
					<FormInput
						name='label'
						type='text'
						innerLabel='이름'
						autoComplete='off'
					/>
					<div className='mt-4'>
						<button
							type='submit'
							className='inline-flex justify-center px-4 py-2 text-sm font-medium text-blue-900 bg-blue-100 border border-transparent rounded-md hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2'
						>
							등록하기
						</button>
					</div>
				</form>
			</FormProvider>
			{toast}
		</Fragment>
	);
};

export default TokenRegisterTab;
