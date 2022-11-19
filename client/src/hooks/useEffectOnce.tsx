import { useEffect, useRef } from 'react';

export const useEffectOnce = (fn: CallableFunction) => {
	const ref = useRef(false);

	useEffect(() => {
		if (!ref.current) {
			ref.current = true;
			fn();
		}
	}, [fn]);
};
