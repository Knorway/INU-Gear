import { useEffect, useState } from 'react';

export const useCountDown = (props: { duration: number; delay: number }) => {
	const [count, setCount] = useState(props.duration);

	useEffect(() => {
		setInterval(() => {
			setCount((prev) => prev - 1);
		}, props.delay);
	}, [props.delay]);

	return { count };
};
