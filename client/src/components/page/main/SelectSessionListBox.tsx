import { useRouter } from 'next/router';
import { Fragment, useCallback, useState } from 'react';

import ListBox from '../../ListBox';

const people = [
	{ name: '진행할 세션을 선택해주세요.' },
	{ name: 'Wade Cooper' },
	{ name: 'Arlene Mccoy' },
	{ name: 'Devon Webb' },
	{ name: 'Tom Cook' },
	{ name: 'Tanya Fox' },
	{ name: 'Hellen Schmidt' },
];

const SelectSessionListBox = () => {
	const [selectedId, setSelectedId] = useState(people[0]['name']);
	const router = useRouter();

	const onClick = useCallback(
		(kind: 'device' | 'panel') => () => {
			if (!selectedId || selectedId === people[0].name) return;
			router.push(`/${kind}/${selectedId}`);
		},
		[router, selectedId]
	);

	const onSelectSessionId = useCallback((sessionId: string) => {
		setSelectedId(sessionId);
	}, []);

	return (
		<Fragment>
			<ListBox
				options={people}
				displayProperty='name'
				onChange={onSelectSessionId}
			/>
			<div className='space-x-4'>
				<button onClick={onClick('panel')}>패널</button>
				<button onClick={onClick('device')}>디바이스</button>
			</div>
		</Fragment>
	);
};

export default SelectSessionListBox;
