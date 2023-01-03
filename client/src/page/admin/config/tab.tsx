import { queryKey } from '~/src/api/queryClient';
import ManageTokenTab from '~/src/page/admin/feature/manageTokenTab';
import OverViewTab from '~/src/page/admin/feature/overviewTab';
import TokenRegisterTab from '~/src/page/admin/feature/tokenRegisterTab';

export type TabName = typeof tabList[number];
// export const tabList = ['overview', 'createToken', 'manageToken'] as const;
export const tabList = ['manageToken', 'createToken'] as const;
export const tabMapping: Record<
	TabName,
	{ label: string; component: React.ReactElement }
> = {
	// overview: {
	// 	label: '개요',
	// 	component: <OverViewTab />,
	// },
	createToken: {
		label: '참가자 등록',
		component: <TokenRegisterTab />,
	},
	manageToken: {
		label: '참가자 관리',
		component: <ManageTokenTab />,
	},
};

export const tabQueryKeyMapping = {
	overview: queryKey.aggregateSequence,
	createToken: [],
	manageToken: queryKey.sessionTokensPage(0),
};
