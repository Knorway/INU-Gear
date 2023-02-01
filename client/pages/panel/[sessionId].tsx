import { PageContextProvider } from '~/src/page/panel/context/PageContext';

import PanelPage from '../../src/page/panel';

const Page = () => {
	return (
		<PageContextProvider>
			<PanelPage />
		</PageContextProvider>
	);
};

export default Page;
