import { Fragment, ReactNode, useCallback, useState } from 'react';

import { Listbox, Transition } from '@headlessui/react';
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid';

type Props<T> = {
	options: T[];
	displayProperty: keyof T[][number];
	onChange: (sessionId: T[keyof T]) => void;
};

const ListBox = <T extends {}>(props: Props<T>) => {
	const [selected, setSelected] = useState(props.options[0]);

	const onSelect = useCallback(
		<E extends T>(e: E) => {
			setSelected(e);
			props.onChange(e[props.displayProperty]);
		},
		[props]
	);

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
						<Listbox.Options className='absolute w-full py-1 mt-1 overflow-auto text-base bg-white rounded-md shadow-lg max-h-60 ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm'>
							{props.options.map((opt, idx) => (
								<Listbox.Option
									key={idx}
									className={({ active }) =>
										`relative cursor-default select-none py-2 pl-10 pr-4 ${
											active
												? 'bg-amber-100 text-amber-900'
												: 'text-gray-900'
										}`
									}
									value={opt}
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
												{opt[props.displayProperty] as ReactNode}
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
