import { Popover, Transition } from '@headlessui/react';
import { CheckCircleIcon, DocumentTextIcon } from '@heroicons/react/24/outline';
import { XCircleIcon } from '@heroicons/react/24/solid';
import React, { Fragment, useEffect, useRef } from 'react';

type Props = {
	variant: 'positive' | 'negative' | 'information';
	title?: React.ReactNode;
	description?: React.ReactNode;
	component?: React.ReactNode;
	className?: {
		panel?: string;
		body?: string;
	};
	onEnter?: () => void;
	onLeave?: () => void;
};

const variantBorder: Record<Props['variant'], string> = {
	positive: 'border-green-500',
	negative: 'border-red-500',
	information: 'border-blue-200',
};

const variantIcons: Record<Props['variant'], React.ReactElement> = {
	positive: (
		<CheckCircleIcon className={`w-5 h-5 text-white rounded-full bg-green-500`} />
	),
	negative: <XCircleIcon className={`w-5 h-5 text-white bg-red-500 rounded-full`} />,
	information: <DocumentTextIcon className={`w-5 h-5 text-black rounded-ful`} />,
};

const Toast = (props: Props) => {
	const buttonRef = useRef<HTMLButtonElement>(null);

	useEffect(() => {
		buttonRef.current?.click();
	}, []);

	const borderColor = variantBorder[props.variant];
	const toastHeight = props.className?.body ? props.className.body : '';
	const bottomOffset = props.className?.panel ? props.className.panel : 'bottom-4';

	return (
		<div
			className={`fixed w-full max-w-sm px-4 -translate-x-1/2 left-1/2 ${bottomOffset}`}
		>
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
							afterEnter={() => props.onEnter?.()}
							afterLeave={() => props.onLeave?.()}
						>
							<Popover.Panel
								static
								className={`relative z-10 w-screen max-w-sm px-4 mt-3 overflow-scroll transform -translate-x-1/2 left-1/2 sm:px-0 lg:max-w-3xl ${toastHeight}`}
							>
								<div
									className={`flex-row items-center justify-center p-4 overflow-hidden transition-all transform bg-white border ${borderColor} shadow-xl rounded-2xl h-full overflow-scroll`}
								>
									<div className='flex items-center space-x-2'>
										<div>{variantIcons[props.variant]}</div>
										<div className='text-xl font-medium leading-6 text-gray-900'>
											{props.title}
										</div>
									</div>
									{props.description && (
										<div className='mt-2'>
											<p className='text-base text-gray-500'>
												{props.description}
											</p>
										</div>
									)}
									<div>{props.component}</div>
								</div>
							</Popover.Panel>
						</Transition>
					</>
				)}
			</Popover>
		</div>
	);
};
export default React.memo(Toast);
