import { useCallback, useEffect, useState } from 'react';

import Toast from '../components/Toast';

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
