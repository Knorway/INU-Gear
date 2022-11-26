import '../dist/output.css';

import { QueryClientProvider } from '@tanstack/react-query';
import Head from 'next/head';

import { queryClient } from '~/src/api/queryClient';
import MainLayout from '~/src/components/layout/MainLayout';

import type { AppProps } from 'next/app';
export default function App({ Component, pageProps }: AppProps) {
	return (
		<QueryClientProvider client={queryClient}>
			<Head>
				<meta name='mobile-web-app-capable' content='yes' />
				<link rel='manifest' href='/manifest.json' />
			</Head>
			<MainLayout>
				<Component {...pageProps} />
			</MainLayout>
		</QueryClientProvider>
	);
}
