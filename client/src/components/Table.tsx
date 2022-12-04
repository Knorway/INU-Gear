import { Fragment } from 'react';

type Props<T> = {
	children: (props: RenderProps<T>) => React.ReactElement;
	tableHeads: Array<string>;
	data: T[];
	globalCheckBox?: boolean;
};

type RenderProps<T> = {
	data: T;
};

const Table = <T,>(props: Props<T>) => {
	return (
		<div className='overflow-x-auto shadow-md sm:rounded-lg'>
			<table className='w-full text-sm text-left text-gray-500'>
				<thead className='text-xs text-gray-700 uppercase bg-gray-50 '>
					<tr>
						{props.globalCheckBox ? (
							<th scope='col' className='p-4'>
								<div className='flex items-center'>
									<input
										id='checkbox-all'
										type='checkbox'
										className='w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2'
									/>
									<label htmlFor='checkbox-all' className='sr-only'>
										checkbox
									</label>
								</div>
							</th>
						) : (
							<th></th>
						)}
						{/* table head */}
						{props.tableHeads.map((head) => (
							<th key={head} scope='col' className='px-6 py-3'>
								{head}
							</th>
						))}
					</tr>
				</thead>
				<tbody>
					{props.data.map((e, idx) => (
						<Fragment key={idx}>{props.children({ data: e })}</Fragment>
					))}
				</tbody>
			</table>
		</div>
	);
};

export default Table;

// <td className='px-6 py-4'>
// 	<a
// 		href='#'
// 		className='font-medium text-blue-600 dark:text-blue-500 hover:underline'
// 	>
// 		{/* {row.at(-1)} */}
// 	</a>
// </td>
