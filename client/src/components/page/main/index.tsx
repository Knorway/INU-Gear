import { ComputerDesktopIcon } from '@heroicons/react/24/solid';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Fragment, useCallback, useState } from 'react';

import { getSessionTokens, SessionToken } from '~/src/api/fetcher';
import ListBox from '~/src/components/ListBox';
import LoadingSpinner from '~/src/components/LoadingSpinner';

import SequenceGrid from './SequenceGrid';

const DEFAULT_LABEL = '세션을 선택해주세요.';

const MainPage = () => {
	const [selectedToken, setSelectedToken] = useState<SessionToken>();
	const router = useRouter();

	const { data: sessionTokens, isLoading } = useQuery({
		queryKey: ['sessionTokens'],
		queryFn: getSessionTokens,
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

	// if (isLoading) return <LoadingSpinner />;
	// if (!sessionTokens) return null;

	return (
		<Fragment>
			{isLoading && <LoadingSpinner />}
			<div className='flex flex-col items-center justify-center'>
				<div className='space-x-4 text-blue-500 underline'>
					<Link href={'/session'}>session</Link>
					<Link href={'/admin'}>admin</Link>
				</div>
				<h1 className='text-4xl font-bold'>Gear</h1>
				<ListBox
					list={sessionTokens ?? []}
					displayProperty='uuid'
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

// const { data: sessionToken } = useQuery({
// 	queryKey: ['sessionToken', selectedToken?.uuid],
// 	queryFn: () => getSessionToken({ uuid: selectedToken?.uuid as string }),
// 	enabled: Boolean(selectedToken),
// });
