import { InputHTMLAttributes } from 'react';
import { useFormContext } from 'react-hook-form';

type Props = InputHTMLAttributes<HTMLInputElement> & {
	name: string;
	innerLabel: string;
};

const FormInput = ({ name, innerLabel, ...rest }: Props) => {
	const { register } = useFormContext();

	return (
		<div>
			{/* <label htmlFor={name} className='block text-sm font-medium text-gray-700'>
				{name}
			</label> */}
			<div className='relative mt-1 rounded-md shadow-sm'>
				<div className='absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none'>
					<span className='text-gray-500 sm:text-sm'>{innerLabel}</span>
				</div>
				<input
					{...register(name)}
					name={name}
					id={name}
					className='block w-full pl-12 pr-12 border-gray-300 rounded-md focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm'
					{...rest}
				/>
				{/* <div className='absolute inset-y-0 right-0 flex items-center'>
						<label htmlFor='currency' className='sr-only'>
							Currency
						</label>
						<select
							id='currency'
							name='currency'
							className='h-full py-0 pl-2 text-gray-500 bg-transparent border-transparent rounded-md pr-7 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm'
						>
							<option>USD</option>
							<option>CAD</option>
							<option>EUR</option>
						</select>
					</div> */}
			</div>
		</div>
	);
};

export default FormInput;
