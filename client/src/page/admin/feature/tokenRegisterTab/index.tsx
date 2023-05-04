// @ts-nocheck
import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { Fragment } from 'react';
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';

import { mutatation } from '~/src/api/fetcher';
import FormInput from '~/src/components/FormInput';
import ListBox from '~/src/components/ListBox';
import Spinner from '~/src/components/Spinner';
import { useNotification } from '~/src/hooks/useNotification';

type FormType = {
	label: string;
	gender: string;
	experience: number;
};

const genderList = [{ gender: '남' }, { gender: '여' }, { gender: '기타' }];
const experienceList = [
	{ experience: 1 },
	{ experience: 2 },
	{ experience: 3 },
	{ experience: 4 },
];

const genderMap = { 남: 1, 여: 2, 기타: 3 };

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
		if (
			Object.values(data).some(
				(e, idx, arr) =>
					arr.length !== 3 || ['', '성별', '운전숙련도'].includes(e)
			)
		)
			return;

		registerSessionToken(
			{
				label: data.label,
				experience: data.experience,
				gender: genderMap[data.gender],
			},
			{
				onSuccess: () => {
					formMethods.reset();
					activateToast({
						variant: 'positive',
						title: '새로운 참가자를 생성했습니다',
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

	const onChangeListBox = (e: FormType) => {
		const [key, value] = Object.entries(e).flat();
		formMethods.setValue(key, value);
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
					<div className='flex space-x-2'>
						<ListBox
							list={genderList}
							defaultLabel='성별'
							displayProperty='gender'
							onChange={onChangeListBox}
						/>
						<ListBox
							list={experienceList}
							defaultLabel='운전숙련도'
							displayProperty='experience'
							onChange={onChangeListBox}
						/>
					</div>
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
