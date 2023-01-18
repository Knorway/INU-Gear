import { useMutation } from '@tanstack/react-query';
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';

import { mutatation } from '~/src/api/fetcher';
import FormInput from '~/src/components/FormInput';

type FormType = {
	account: string;
	password: string;
};

const SignInPage = () => {
	const formMethods = useForm<FormType>();

	const {
		mutate: signIn,
		isLoading,
		error,
	} = useMutation({
		mutationFn: mutatation.singIn,
	});

	const submitHandler: SubmitHandler<FormType> = (data) => {
		signIn(data, {
			onSuccess: (data) => {
				localStorage.setItem('token', data);
				location.reload();
			},
		});
	};

	return (
		<div className='flex items-center justify-center p-4'>
			<FormProvider {...formMethods}>
				<form
					onSubmit={formMethods.handleSubmit(submitHandler)}
					className='flex-row w-1/4 space-y-4'
				>
					<h1 className='text-2xl font-bold'>관리자 로그인</h1>
					<FormInput
						name='account'
						type='text'
						placeholder='계정'
						innerLabel=''
						autoComplete='off'
						className='pl-2'
					/>
					<FormInput
						name='password'
						type='password'
						placeholder='비밀번호'
						innerLabel=''
						autoComplete='off'
						className='pl-2'
					/>
					<div className='mt-2'>
						<small className='text-red-400'>
							{Boolean(error) &&
								'로그인에 실패했습니다. 계정 정보를 다시 확인해주세요'}
						</small>
					</div>
					<div className='mt-4'>
						<button
							type='submit'
							className='inline-flex justify-center px-4 py-2 text-sm font-medium text-blue-900 bg-blue-100 border border-transparent rounded-md hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2'
							disabled={isLoading}
						>
							로그인
						</button>
					</div>
				</form>
			</FormProvider>
		</div>
	);
};

export default SignInPage;
