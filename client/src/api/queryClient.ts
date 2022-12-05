import { QueryClient } from '@tanstack/react-query';

export type ParamOf<T extends (args: any) => any> = Parameters<T>[0];

export const mutationizeFetcher =
	<T extends (args: any) => ReturnType<T>>(fn: T) =>
	(param: ParamOf<T>) =>
		fn(param);

export const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			refetchOnWindowFocus: false,
		},
	},
});

export const queryKey = {
	sessionTokens: ['sessionTokens'],
	sessionTokensPage: (page: number) => ['sessionTokens', page] as const,
	aggregateSequence: ['sessionTokens'],
	// aggregateSequence: ['aggregate', 'sequence'],
	sessionLog: (sequenceId: string) => ['sessionLog', sequenceId] as const,
};
