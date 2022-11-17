import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';

export const BACKEND_URL = (() => {
	if (process.env.NODE_ENV === 'production') {
		return 'http://158.247.234.222:8090';
	}
	return 'http://127.0.0.1:8090';

	// if (typeof window === 'undefined') return;
	// const ip = localStorage.getItem('local_ip');
	// if (!ip) return;
	// return `http://${ip}:8090`;
})();

const client = axios.create({
	baseURL: BACKEND_URL,
});

export const request = async <T>(config: AxiosRequestConfig) => {
	const token = localStorage.getItem('access_token');

	return (await client({
		...config,
		headers: {
			...(token && { Authorization: `Bearer ${token}` }),
		},
	})) as AxiosResponse<T>;
};
