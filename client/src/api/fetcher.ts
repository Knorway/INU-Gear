import { request } from '~/src/api/request';
import {
  MessageStream,
  SequenceChar,
  SEQUENCES,
  SessionLogResult,
} from '~/src/config/settings';

export type SessionToken = {
	id: number;
	uuid: string;
	createdAt: Date;
	label: string;
	mangerId: number;
	sequence: typeof SEQUENCES;
	// TODO: isFinished
};

export const getSessionTokens = async () => {
	const response = await request<SessionToken[]>({ url: '/session-token' });
	return response.data;
};

export const getSessionToken = async ({ uuid }: { uuid: string }) => {
	const response = await request<SessionToken>({ url: `/session-token/${uuid}` });
	return response.data;
};

export const postSessionToken = async (data: { label: string }) => {
	const response = await request<SessionToken>({
		url: `/session-token`,
		method: 'POST',
		data,
	});
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

export const patchSequence = async ({
	uuid,
	sequence,
}: {
	uuid: string;
	sequence: typeof SEQUENCES[number];
}) => {
	const response = await request<SessionToken>({
		url: `/session-token/${uuid}`,
		method: 'PATCH',
		data: sequence,
	});
	return response.data;
};

export const postSessionLog = async ({
	uuid,
	data,
}: {
	uuid: string;
	data: SessionLogResult[];
}) => {
	const response = await request<never>({
		url: `/session-log/${uuid}`,
		method: 'POST',
		data,
	});
	return response.data;
};

export const getSimpleSequnceAgg = async ({ sequence }: { sequence: SequenceChar[] }) => {
	const response = await request<unknown>({
		url: `/aggregate/${JSON.stringify(sequence)}`,
		method: 'GET',
	});
	return response.data;
};
