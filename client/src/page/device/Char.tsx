import { SequenceChar } from '~/src/config/settings';

const Char = (props: { char: SequenceChar; tint: string }) => {
	const letterSpacing =
		props.char === 'N' ? 'tracking-[-1.07rem]' : 'tracking-[-0.85rem]';

	return (
		<span
			style={{ color: props.tint }}
			className={`block ${letterSpacing} leading-[5.7rem]`}
		>
			{props.char}
		</span>
	);
};

export default Char;
