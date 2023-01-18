import { request } from '~/src/api/request';
import {
  MessageStream,
  SequenceChar,
  SEQUENCES,
  SessionLogResult,
} from '~/src/config/settings';

import { mutationizeFetcher } from './queryClient';

export type SessionToken = {
	id: number;
	uuid: string;
	createdAt: Date;
	label: string;
	mangerId: number;
	sequence: typeof SEQUENCES;
	// TODO: isFinished
};

export type UserProfile = {
	id: number;
	uuid: string;
	account: string;
	createdAt: string;
};

export const query = {
	getUserProfile: async () => {
		const response = await request<UserProfile>({
			url: `/auth/validate`,
			method: 'GET',
		});
		return response.data;
	},
	getSessionTokens: async (param?: {
		page?: number;
		search?: string;
		context?: 'main';
	}) => {
		let query = '';
		for (const key in param) {
			query += `${key}=${param[key as keyof typeof param] ?? ''}&`;
		}

		const response = await request<{
			tokens: SessionToken[];
			hasNext: boolean;
			count: number;
			totalCount: number;
		}>({
			url: `/session-token?${query}`,
		});
		return response.data;
	},
	getSessionToken: async ({ uuid }: { uuid: string }) => {
		const response = await request<SessionToken>({ url: `/session-token/${uuid}` });
		return response.data;
	},
	getSessionLog: async ({ uuid }: { uuid: string }) => {
		if (!uuid) return null;
		const response = await request<any>({
			url: `/session-log/${uuid}`,
		});
		return response.data;
	},
	getOverviewAggregate: async ({ sequence }: { sequence: SequenceChar[] }) => {
		const response = await request<unknown>({
			url: `/aggregate/${JSON.stringify(sequence)}`,
			method: 'GET',
		});
		return response.data;
	},
};

export const mutatation = {
	singIn: mutationizeFetcher(async (data: { account: string; password: string }) => {
		const response = await request<string>({
			url: `/auth/sign-in`,
			method: 'POST',
			data,
		});
		return response.data;
	}),
	postSessionToken: mutationizeFetcher(async (data: { label: string }) => {
		const response = await request<SessionToken>({
			url: `/session-token`,
			method: 'POST',
			data,
		});
		return response.data;
	}),
	deleteSessionToken: mutationizeFetcher(async (data: { tokens: string[] }) => {
		const response = await request<any>({
			url: `/session-token`,
			method: 'DELETE',
			data,
		});
		return response.data;
	}),
	postMessageStream: mutationizeFetcher(
		async ({ uuid, message }: { uuid: string; message: MessageStream }) => {
			const response = await request<never>({
				url: `/publish/${uuid}`,
				method: 'POST',
				data: message,
			});
			return response.data;
		}
	),
	postSessionLog: mutationizeFetcher(
		async (data: {
			uuid: string;
			logs: SessionLogResult[];
			sequence: typeof SEQUENCES[number];
		}) => {
			const response = await request<never>({
				url: `/session-log`,
				method: 'POST',
				data,
			});
			return response.data;
		}
	),
	deleteSessionLog: mutationizeFetcher(
		async (data: { uuids: string[]; sequence: unknown; tokenId: string }) => {
			const response = await request<never>({
				url: `/session-log`,
				method: 'DELETE',
				data,
			});
			return response.data;
		}
	),
};
