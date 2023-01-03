import { useCallback, useEffect, useState } from 'react';

import Toast from '../components/Toast';

// TODO: 이건 useTimeout 만든 다음에 그걸 활용하는 식으로 하는 게 맞는 것 같다.
// useCounddown도 useInterval 만든 다음에 하는 게 나을지도
// 기초적인 유틸 훅들 다시 숙지하기. 다 까먹음

type ToastOption = {
	variant: 'positive' | 'negative' | 'information';
	title: string;
	description: string;
};

export const useNotification = ({ timeout = 3500 }: { timeout?: number } = {}) => {
	const [active, setActive] = useState(false);
	const [options, setOptions] = useState<ToastOption>();

	const activateToast = useCallback((option: Parameters<typeof setOptions>[0]) => {
		setOptions(option);
		setActive(true);
	}, []);

	useEffect(() => {
		if (!active) return;
		const id = setTimeout(() => {
			setActive(false);
		}, timeout);

		return () => {
			clearTimeout(id);
		};
	}, [active, timeout]);

	return { activateToast, toast: active ? <Toast {...options!} /> : null };
};
