import { QueryClient } from '@tanstack/react-query';

export type ParamOf<T extends (...args: any) => any> = Parameters<T>[0];

export const mutationizeFetcher =
	<T extends (args: any) => ReturnType<T>>(fn: T) =>
	(param: ParamOf<T>) =>
		fn(param);

export const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			refetchOnWindowFocus: true,
		},
	},
});

export const queryKey = {};
