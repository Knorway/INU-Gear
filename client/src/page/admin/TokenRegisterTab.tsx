import { useMutation } from '@tanstack/react-query';
import { Fragment } from 'react';
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';

import { postSessionToken } from '~/src/api/fetcher';
import { mutationizeFetcher } from '~/src/api/queryClient';
import FormInput from '~/src/components/FormInput';
import Spinner from '~/src/components/notifier/Spinner';
import Toast from '~/src/components/notifier/Toast';
import { useNotification } from '~/src/hooks/useNotification';

type FormType = {
	label: string;
};

const TokenRegisterTab = () => {
	const formMethods = useForm<FormType>();
	const { isActive, activate } = useNotification();

	const {
		mutate: registerSessionToken,
		data,
		isLoading,
	} = useMutation({
		mutationFn: mutationizeFetcher(postSessionToken),
	});

	const registerToken: SubmitHandler<FormType> = async (data) => {
		registerSessionToken(
			{ label: data.label },
			{
				onSuccess: () => {
					formMethods.reset();
					activate();
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
					<h1 className='text-4xl font-bold'>Register session token</h1>
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
			{isActive && (
				<Toast
					variant='positive'
					title='유저 세션을 생성했습니다'
					description={JSON.stringify({
						label: data?.label,
						token: data?.uuid,
					})}
				/>
			)}
		</Fragment>
	);
};

export default TokenRegisterTab;
