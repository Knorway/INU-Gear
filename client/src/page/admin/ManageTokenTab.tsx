import { Fragment } from 'react';

import Pagination from '~/src/components/Pagination';
import SearchInput from '~/src/components/SearchInput';

import TokenTable from './TokenTable';

const ManageTokenTab = () => {
	return (
		<Fragment>
			<div className='flex-col space-y-3'>
				<SearchInput />
				<TokenTable />
				<Pagination />
			</div>
		</Fragment>
	);
};

export default ManageTokenTab;
