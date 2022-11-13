import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import { Fragment, useCallback, useMemo, useState } from 'react';

import { getSessionTokens, SessionToken } from '~/src/api/fetcher';
import ListBox from '~/src/components/ListBox';

const SessionTokenListBox = () => {
	const [selectedToken, setSelectedToken] = useState<SessionToken>();
	const { data: sessionTokens } = useQuery({
		queryKey: ['sessionTokens'],
		queryFn: getSessionTokens,
	});
	const defaultLabel = useMemo(() => '세션을 선택해주세요.', []);

	const router = useRouter();

	const selectDisplayType = useCallback(
		(kind: 'device' | 'panel') => () => {
			if (!selectedToken || selectedToken.uuid === defaultLabel) return;
			router.push(`/${kind}/${selectedToken.uuid}`);
		},
		[router, selectedToken, defaultLabel]
	);

	const selectSessionToken = useCallback((token: SessionToken) => {
		setSelectedToken(token);
	}, []);

	if (!sessionTokens) return null;

	return (
		<Fragment>
			<ListBox
				list={sessionTokens ?? []}
				displayProperty='uuid'
				defaultLabel={defaultLabel}
				onChange={selectSessionToken}
			/>
			<div className='space-x-4'>
				<button onClick={selectDisplayType('panel')}>패널</button>
				<button onClick={selectDisplayType('device')}>디바이스</button>
			</div>
		</Fragment>
	);
};

export default SessionTokenListBox;
