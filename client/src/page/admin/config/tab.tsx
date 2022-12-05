import { queryKey } from '~/src/api/queryClient';
import ManageTokenTab from '~/src/page/admin/ManageTokenTab';
import OverViewTab from '~/src/page/admin/OverViewTab';
import TokenRegisterTab from '~/src/page/admin/TokenRegisterTab';

export type TabName = typeof tabList[number];
export const tabList = ['overview', 'createToken', 'manageToken'] as const;
export const tapMapping: Record<
	TabName,
	{ label: string; component: React.ReactElement }
> = {
	overview: {
		label: '개요',
		component: <OverViewTab />,
	},
	createToken: {
		label: '참가자 생성',
		component: <TokenRegisterTab />,
	},
	manageToken: {
		label: '참가자 관리',
		component: <ManageTokenTab />,
	},
};

export const tabQueryKeyMapping: Record<TabName, string[]> = {
	overview: queryKey.aggregateSequence,
	createToken: [],
	manageToken: queryKey.sessionTokens,
};
