import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Fragment, useCallback, useState } from 'react';
import { useFormContext } from 'react-hook-form';

import { query } from '~/src/api/fetcher';
import { queryKey } from '~/src/api/queryClient';
import Table from '~/src/components/Table';
import { useCtx } from '~/src/hooks/useCtx';

import {
  FeatureDispatchContext,
  FeatureStateContext,
} from './context/FeatureContext';
import LogDocument from './LogDocument';

const tableHeads = ['이름', '식별번호', '등록일자', '완료'];

const TokenTable = () => {
	const [expandedRow, setExpandedRow] = useState('');
	const featureState = useCtx(FeatureStateContext);
	const featureDispatch = useCtx(FeatureDispatchContext);

	const { register } = useFormContext();

	const queryClient = useQueryClient();

	const { data } = useQuery({
		queryKey: queryKey.sessionTokensPage(featureState.tokenPage),
		queryFn: ({ queryKey }) => query.getSessionTokens({ page: queryKey[1] }),
		onSuccess(data) {
			if (data.hasNext) {
				queryClient.prefetchQuery({
					queryKey: queryKey.sessionTokensPage(featureState.tokenPage + 1),
					queryFn: ({ queryKey }) =>
						query.getSessionTokens({ page: queryKey[1] }),
				});
			}

			featureDispatch({
				hasNext: data.hasNext,
				count: data.count,
				totalCount: data.totalCount,
			});
		},
	});

	const { data: log } = useQuery({
		queryKey: queryKey.sessionLog(expandedRow),
		queryFn: ({ queryKey }) => query.getSessionLog({ uuid: queryKey[1] }),
		enabled: Boolean(expandedRow),
	});

	const expandRow = (uuid: string) => {
		setExpandedRow(uuid);
	};

	const clearExpanding = useCallback(() => {
		setExpandedRow('');
	}, []);

	if (!data) return null;

	return (
		<Fragment>
			<Table data={data.tokens} tableHeads={tableHeads}>
				{({ data }) => (
					<Fragment>
						<tr
							key={data.uuid}
							className='bg-white border-b cursor-pointer hover:bg-gray-100'
							onClick={() => expandRow(data.uuid)}
						>
							<td className='w-4 p-4'>
								<div className='flex items-center'>
									<input
										id='checkbox-table-1'
										type='checkbox'
										className='w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 focus:ring-2 '
										onClick={(e) => e.stopPropagation()}
										value={data.uuid}
										{...register('checkedTokens')}
									/>
									<label htmlFor='checkbox-table-1' className='sr-only'>
										checkbox
									</label>
								</div>
							</td>
							<th
								scope='row'
								className='px-6 py-4 font-medium text-gray-900 whitespace-nowrap'
							>
								{data.label}
							</th>
							<td className='px-6 py-4'>{data.uuid}</td>
							<td className='px-6 py-4'>
								{data.createdAt.toString().substring(0, 10)}
							</td>
							<td className='px-6 py-4'>{data.isFinished ? '✔' : ''}</td>
						</tr>
						{expandedRow === data.uuid && (
							<LogDocument
								log={log}
								token={data}
								onUnmount={clearExpanding}
							/>
						)}
					</Fragment>
				)}
			</Table>
		</Fragment>
	);
};

export default TokenTable;
