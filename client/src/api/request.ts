import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';

export const BACKEND_URL = (() => {
	if (process.env.NODE_ENV !== 'production') {
		return process.env.NEXT_PUBLIC_BACKEND_URL_DEV;
	}
	return '';

	// if (typeof window === 'undefined') return;
	// const ip = localStorage.getItem('local_ip');
	// if (!ip) return;
	// return `http://${ip}:8090`;
})();

const client = axios.create({
	baseURL: BACKEND_URL,
});

export const request = async <T>(config: AxiosRequestConfig) => {
	const token = localStorage.getItem('token');

	return <AxiosResponse<T>>await client({
		...config,
		headers: {
			...(token && { Authorization: `Bearer ${token}` }),
		},
	});
};
