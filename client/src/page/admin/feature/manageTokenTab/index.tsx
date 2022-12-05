import { FormProvider, useForm } from 'react-hook-form';

import Pagination from '~/src/components/Pagination';

import TokenSearchInput from './TokenSearchInput';
import TokenTable from './TokenTable';

type FormType = {
	checkedTokens: string[];
};

const ManageTokenTab = () => {
	const formMethods = useForm<FormType>();

	return (
		<FormProvider {...formMethods}>
			<div className='flex-col space-y-3'>
				<div>
					<TokenSearchInput />
				</div>
				<TokenTable />
				<Pagination />
			</div>
		</FormProvider>
	);
};

export default ManageTokenTab;
