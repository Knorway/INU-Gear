import { Disclosure } from '@headlessui/react';
import { Fragment, HTMLAttributes } from 'react';

type Props = {
	text: {
		button: string | React.ReactElement | JSX.Element;
		panel: string | React.ReactElement | JSX.Element;
	};
	className?: {
		button: HTMLAttributes<unknown>['className'];
		panel: HTMLAttributes<unknown>['className'];
	};
	onClick?: () => void;
};

const Accordion = (props: Props) => {
	return (
		<Disclosure>
			<div>
				<Disclosure.Button className={props.className?.button}>
					{props.text.button}
				</Disclosure.Button>
			</div>
			<div>
				<Disclosure.Panel className={props.className?.panel}>
					{props.text.panel}
				</Disclosure.Panel>
			</div>
		</Disclosure>
	);
};

export default Accordion;
