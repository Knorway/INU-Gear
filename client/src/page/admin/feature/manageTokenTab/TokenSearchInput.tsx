import { TrashIcon } from '@heroicons/react/24/outline';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Fragment } from 'react';
import { SubmitHandler, useFormContext } from 'react-hook-form';

import { mutatation } from '~/src/api/fetcher';
import { queryKey } from '~/src/api/queryClient';
import Spinner from '~/src/components/Spinner';

type FormType = {
	checkedTokens: string[];
};

const TokenSearchInput = () => {
	const { handleSubmit } = useFormContext<FormType>();
	const queryClient = useQueryClient();

	const { mutate: deleteSelectedTokens, isLoading: isDeletingTokens } = useMutation({
		mutationFn: mutatation.deleteSessionToken,
	});

	const deleteTokens: SubmitHandler<FormType> = async (data) => {
		if (!data.checkedTokens.length) return;
		const confirm = window.confirm(
			`아래 식별번호에 해당하는 참가자를 삭제합니다: \n${JSON.stringify(
				data.checkedTokens,
				null,
				2
			)} \n계속하시겠습니까?`
		);
		if (!confirm) return;

		deleteSelectedTokens(
			{ tokens: data.checkedTokens },
			{
				onSuccess: () => {
					queryClient.invalidateQueries({ queryKey: queryKey.sessionTokens });
				},
			}
		);
	};

	return (
		<Fragment>
			{isDeletingTokens && <Spinner />}
			<div className='flex flex-row items-center justify-between w-full'>
				<div>
					<label htmlFor='table-search' className='sr-only'>
						Search
					</label>
					<div className='relative'>
						<div className='absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none'>
							<svg
								className='w-5 h-5 text-gray-500'
								aria-hidden='true'
								fill='currentColor'
								viewBox='0 0 20 20'
								xmlns='http://www.w3.org/2000/svg'
							>
								<path
									fillRule='evenodd'
									d='M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z'
									clipRule='evenodd'
								></path>
							</svg>
						</div>
						<input
							type='text'
							id='table-search-users'
							className='block p-2 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg w-80 bg-gray-50 focus:ring-blue-500 focus:border-blue-500 '
							placeholder='Search for users'
						/>
					</div>
				</div>
				<TrashIcon
					className='w-8 h-8 p-1 border rounded-md cursor-pointer'
					onClick={handleSubmit(deleteTokens)}
				>
					submit
				</TrashIcon>
			</div>
		</Fragment>
	);
};

export default TokenSearchInput;