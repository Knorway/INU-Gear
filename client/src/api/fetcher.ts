import { request } from '~/src/api/request';
import { MessageStream, SEQUENCES } from '~/src/config/settings';

export type SessionToken = {
	id: number;
	uuid: string;
	createdAt: Date;
	mangerId: number;
	sequence: typeof SEQUENCES;
	repetition: number;
};

export const getSessionTokens = async () => {
	const response = await request<SessionToken[]>({ url: '/session-token' });
	return response.data;
};

export const getSessionToken = async ({ uuid }: { uuid: string }) => {
	const response = await request<SessionToken>({ url: `/session-token/${uuid}` });
	return response.data;
};

export const postMessageStream = async ({
	uuid,
	message,
}: {
	uuid: string;
	message: MessageStream;
}) => {
	const response = await request<never>({
		url: `/publish/${uuid}`,
		method: 'POST',
		data: message,
	});
	return response.data;
};
