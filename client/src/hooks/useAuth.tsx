import { useQuery } from '@tanstack/react-query';

import { query } from '../api/fetcher';
import { queryKey } from '../api/queryClient';

export const useAuth = () => {
	const { data, isLoading } = useQuery({
		queryKey: queryKey.userProfile,
		queryFn: query.getUserProfile,
		retry: false,
		refetchOnMount: false,
	});

	return {
		profile: data,
		notLoggedIn: !data && !isLoading,
		isLoading,
	};
};
