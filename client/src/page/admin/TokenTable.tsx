import { useQuery } from '@tanstack/react-query';
import _ from 'lodash';
import { Fragment, useMemo, useState } from 'react';

import { query, SessionToken } from '~/src/api/fetcher';
import Spinner from '~/src/components/notifier/Spinner';
import Toast from '~/src/components/notifier/Toast';
import Table from '~/src/components/Table';
import { Sequence, SequenceChar } from '~/src/config/settings';

type KeyChars = `${SequenceChar},${SequenceChar},${SequenceChar}`;
type ParsedLog = Record<Sequence<'type'>, Record<KeyChars, SessionToken[]>>;
type ValueOf<T> = T[keyof T];

const tableHeads = ['이름', '식별번호'];

const TokenTable = () => {
	const [expandedRow, setExpandedRow] = useState('');

	const { data: sessionTokens, isLoading } = useQuery({
		queryKey: ['sessionTokens'],
		queryFn: query.getSessionTokens,
	});

	const { data: log } = useQuery({
		queryKey: ['sessionLog', expandedRow],
		queryFn: ({ queryKey }) => query.getSessionLog({ uuid: queryKey[1] }),
		enabled: Boolean(expandedRow),
	});

	const expandRow = (uuid: string) => {
		setExpandedRow(uuid !== expandedRow ? uuid : '');
	};

	const parsedLog = useMemo(() => {
		return Object.entries(_.groupBy(log, 'type')).reduce((map, [type, log]) => {
			map[type as keyof ParsedLog] = _.groupBy(
				log,
				'sequence'
			) as ValueOf<ParsedLog>;
			return map;
		}, {} as ParsedLog);
	}, [log]);

	if (!sessionTokens) return null;

	return (
		<Fragment>
			{isLoading && <Spinner />}
			<Table data={sessionTokens} tableHeads={tableHeads}>
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
						</tr>
						{expandedRow === data.uuid && (
							<Toast
								variant='information'
								className={{ body: 'max-h-[95vh] h-screen' }}
								title={<span className='font-bold'>{data.label}</span>}
								description={
									<span className='text-black'>{data.uuid}</span>
								}
								component={
									<div className='relative'>
										<span className='text-black'>
											생성된 로그: {log?.length}
										</span>
										{_.isEmpty(parsedLog) ? (
											<div>아직 시작하지 않은 세션입니다.</div>
										) : (
											<pre>
												{JSON.stringify(parsedLog, null, 2)}
											</pre>
										)}
									</div>
								}
							/>
						)}
					</Fragment>
				)}
			</Table>
		</Fragment>
	);
};

export default TokenTable;
