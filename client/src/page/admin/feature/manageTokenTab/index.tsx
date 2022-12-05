import { FormProvider, useForm } from 'react-hook-form';

import { FeatureContextProvider } from './context/FeatureContext';
import TokenPagination from './TokenPagination';
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
				<FeatureContextProvider>
					<TokenTable />
					<TokenPagination />
				</FeatureContextProvider>
			</div>
		</FormProvider>
	);
};

export default ManageTokenTab;
