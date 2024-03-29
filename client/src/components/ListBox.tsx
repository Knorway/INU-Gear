import { Listbox, Transition } from '@headlessui/react';
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid';
import { Fragment, ReactNode, useCallback, useEffect, useMemo, useState } from 'react';

type Props<T> = {
	list: T[];
	displayProperty: keyof T;
	defaultLabel: string;
	onChange: (field: T) => void;
};

const ListBox = <T extends object>(props: Props<T>) => {
	const listOptions = useMemo(
		() => [{ [props.displayProperty]: props.defaultLabel } as T, ...props.list],
		[props.displayProperty, props.list, props.defaultLabel]
	);

	const [selected, setSelected] = useState(listOptions[0]);

	const onSelect = useCallback(
		(e: T) => {
			setSelected(e);
			props.onChange(e);
		},
		[props]
	);

	useEffect(() => {
		setSelected(listOptions[0]);
	}, [listOptions]);

	return (
		<div className='top-16 w-72'>
			<Listbox value={selected} onChange={onSelect}>
				<div className='relative mt-1'>
					<Listbox.Button className='relative w-full py-2 pl-3 pr-10 text-left bg-white rounded-lg shadow-md cursor-default focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm'>
						<span className='block truncate'>
							{selected[props.displayProperty] as ReactNode}
						</span>
						<span className='absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none'>
							<ChevronUpDownIcon
								className='w-5 h-5 text-gray-400'
								aria-hidden='true'
							/>
						</span>
					</Listbox.Button>
					<Transition
						as={Fragment}
						leave='transition ease-in duration-100'
						leaveFrom='opacity-100'
						leaveTo='opacity-0'
					>
						<Listbox.Options className='absolute z-10 w-full py-1 mt-1 overflow-auto text-base bg-white rounded-md shadow-lg max-h-60 ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm'>
							{/* {props.list.map((opt, idx) => ( */}
							{listOptions.map((option, idx) => (
								<Listbox.Option
									key={idx}
									className={({ active }) =>
										`relative cursor-default select-none py-2 pl-10 pr-4 ${
											active
												? 'bg-amber-100 text-amber-900'
												: 'text-gray-900'
										}`
									}
									value={option}
								>
									{({ selected }) => (
										<>
											<span
												className={`block truncate ${
													selected
														? 'font-medium'
														: 'font-normal'
												}`}
											>
												{
													option[
														props.displayProperty
													] as ReactNode
												}
											</span>
											{selected ? (
												<span className='absolute inset-y-0 left-0 flex items-center pl-3 text-amber-600'>
													<CheckIcon
														className='w-5 h-5'
														aria-hidden='true'
													/>
												</span>
											) : null}
										</>
									)}
								</Listbox.Option>
							))}
						</Listbox.Options>
					</Transition>
				</div>
			</Listbox>
		</div>
	);
};

export default ListBox;
