import { FormProvider, useForm } from 'react-hook-form';

import { TokenTableForm } from '../../config/table';
import { FeatureContextProvider } from './context/FeatureContext';
import TokenPagination from './TokenPagination';
import TokenSearchInput from './TokenSearchInput';
import TokenTable from './TokenTable';

const ManageTokenTab = () => {
	const formMethods = useForm<TokenTableForm>();

	return (
		<FormProvider {...formMethods}>
			<FeatureContextProvider>
				<div className='flex-col space-y-3'>
					<div>
						<TokenSearchInput />
					</div>
					<TokenTable />
					<TokenPagination />
				</div>
			</FeatureContextProvider>
		</FormProvider>
	);
};

export default ManageTokenTab;
