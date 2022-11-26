import { Popover, Transition } from '@headlessui/react';
import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';
import React, { Fragment, useEffect, useRef } from 'react';

type Props = {
	variant: 'positive' | 'negative';
	title: string;
	description?: string;
};

const variantIcons: Record<Props['variant'], React.ReactElement> = {
	positive: (
		<CheckCircleIcon className='w-5 h-5 text-white bg-green-500 rounded-full' />
	),
	negative: <XCircleIcon className='w-5 h-5 text-white bg-red-500 rounded-full' />,
};

const Notifiation = (props: Props) => {
	const buttonRef = useRef<HTMLButtonElement>(null);

	useEffect(() => {
		buttonRef.current?.click();
	}, []);

	return (
		<div className='fixed w-full max-w-sm px-4 -translate-x-1/2 bottom-4 left-1/2'>
			<Popover className='relative'>
				{({ open }) => (
					<>
						<Popover.Button ref={buttonRef}></Popover.Button>
						<Transition
							as={Fragment}
							enter='transition ease-out duration-200'
							enterFrom='opacity-0 translate-y-1'
							enterTo='opacity-100 translate-y-0'
							leave='transition ease-in duration-150'
							leaveFrom='opacity-100 translate-y-0'
							leaveTo='opacity-0 translate-y-1'
						>
							<Popover.Panel
								static
								className='relative z-10 w-screen max-w-sm px-4 mt-3 transform -translate-x-1/2 left-1/2 sm:px-0 lg:max-w-3xl'
							>
								<div className='flex-row items-center justify-center p-4 overflow-hidden transition-all transform bg-white shadow-xl rounded-2xl'>
									<div className='flex items-center space-x-2'>
										<div>{variantIcons[props.variant]}</div>
										<div className='text-lg font-medium leading-6 text-gray-900'>
											{props.title}
										</div>
									</div>
									{props.description && (
										<div className='mt-2'>
											<p className='text-sm text-gray-500'>
												{props.description}
											</p>
										</div>
									)}
								</div>
							</Popover.Panel>
						</Transition>
					</>
				)}
			</Popover>
		</div>
	);
};
export default React.memo(Notifiation);
