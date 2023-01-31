import { ComputerDesktopIcon } from '@heroicons/react/24/solid';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import { Fragment, useCallback, useState } from 'react';

import { query, SessionToken } from '~/src/api/fetcher';
import { queryKey } from '~/src/api/queryClient';
import ListBox from '~/src/components/ListBox';
import Spinner from '~/src/components/Spinner';

import SequenceGrid from './SequenceGrid';

const DEFAULT_LABEL = '세션을 선택해주세요.';

const MainPage = () => {
	const [selectedToken, setSelectedToken] = useState<SessionToken>();
	const router = useRouter();

	const { data, isLoading } = useQuery({
		queryKey: queryKey.sessionTokens,
		queryFn: () => query.getSessionTokens({ context: 'main' }),
		refetchOnWindowFocus: true,
	});

	const selectDisplayType = useCallback(
		(kind: 'device' | 'panel') => () => {
			if (!selectedToken || selectedToken.uuid === DEFAULT_LABEL) return;
			router.push(`/${kind}/${selectedToken.uuid}`);
		},
		[router, selectedToken]
	);

	const selectSessionToken = useCallback((token: SessionToken) => {
		setSelectedToken(token);
	}, []);

	return (
		<Fragment>
			{isLoading && <Spinner />}
			<div className='flex flex-col items-center justify-center mt-4'>
				<div className='space-x-4 text-blue-500 underline'></div>
				<h1 className='text-4xl font-bold'>Gear</h1>
				<ListBox
					list={data?.tokens ?? []}
					displayProperty='label'
					defaultLabel={DEFAULT_LABEL}
					onChange={selectSessionToken}
				/>
				<div className='space-x-4'>
					<ComputerDesktopIcon
						onClick={selectDisplayType('panel')}
						className='w-8 h-8 p-1 mt-4 border rounded-md cursor-pointer'
					/>
				</div>
			</div>
			<div>
				<SequenceGrid sessionToken={selectedToken} />
			</div>
		</Fragment>
	);
};

export default MainPage;
