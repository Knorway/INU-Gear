import { request } from '~/src/api/request';
import { SEQUENCES } from '~/src/config/settings';

export type SessionToken = {
	id: number;
	uuid: string;
	createdAt: Date;
	mangerId: number;
	sequence: typeof SEQUENCES;
};

export const getSessionTokens = async () => {
	const response = await request<SessionToken[]>({ url: '/session-token' });
	return response.data;
};

export const getSessionToken = async ({ uuid }: { uuid: string }) => {
	const response = await request<SessionToken>({ url: `/session-token/${uuid}` });
	return response.data;
};
