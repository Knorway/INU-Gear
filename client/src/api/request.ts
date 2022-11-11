import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';

const client = axios.create({
	baseURL: 'http://172.30.1.33:8090',
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
