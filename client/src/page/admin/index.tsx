import { PageContextProvider } from './context/PageContext';
import SideTabList from './SideTabList';
import TabComponent from './TabComponent';

const AdminPage = () => {
	return (
		<PageContextProvider>
			<div className='flex w-3/5 h-screen m-auto border border-t-0'>
				<div className='p-3 px-4 space-y-2 border-r'>
					<SideTabList />
				</div>

				<div className='w-full p-2 px-20'>
					<TabComponent />
				</div>
			</div>
		</PageContextProvider>
	);
};

export default AdminPage;
