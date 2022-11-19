import { useEffect, useState } from 'react';

type Props = {
	duration: number;
	delay: number;
};

export const useCountDown = (props: Props) => {
	const [count, setCount] = useState(props.duration);

	useEffect(() => {
		setInterval(() => {
			setCount((prev) => prev - 1);
		}, props.delay);
	}, [props.delay]);

	return { count };
};
