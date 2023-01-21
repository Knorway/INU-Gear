import '../dist/output.css';

import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { AppProps } from 'next/app';
import Head from 'next/head';

import { queryClient } from '~/src/api/queryClient';
import MainLayout from '~/src/components/layout/MainLayout';
import { useAuth } from '~/src/hooks/useAuth';
import SignInPage from '~/src/page/sign-in';

export default function App({ Component, pageProps }: AppProps) {
	return (
		<QueryClientProvider client={queryClient}>
			{/* !error boundary */}
			<Head>
				<meta name='mobile-web-app-capable' content='yes' />
				<link rel='manifest' href='/manifest.json' />
			</Head>
			<EntryPoint Component={Component} pageProps={pageProps} />
			{/* <GlobalNotifier /> */}
			{/* <GlobalLoadingSpinner /> */}
			<ReactQueryDevtools />
		</QueryClientProvider>
	);
}

const EntryPoint = ({
	Component,
	pageProps,
}: {
	Component: AppProps['Component'];
	pageProps: AppProps['pageProps'];
}) => {
	const { isLoading, notLoggedIn } = useAuth();

	if (isLoading) {
		return <MainLayout>{null}</MainLayout>;
	}

	if (notLoggedIn) {
		return (
			<MainLayout>
				<SignInPage />
			</MainLayout>
		);
	}

	return (
		<MainLayout>
			<Component {...pageProps} />
		</MainLayout>
	);
};
