import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';

// export const BACKEND_URL = 'http://localhost:8090';
export const BACKEND_URL = 'http://192.168.0.10:8090';
// export const BACKEND_URL = 'http://172.30.1.22:8090';

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
