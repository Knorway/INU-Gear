import '../dist/output.css';

import Head from 'next/head';

import { QueryClientProvider } from '@tanstack/react-query';

import { queryClient } from '../src/api/queryClient';

import type { AppProps } from 'next/app';

export default function App({ Component, pageProps }: AppProps) {
	return (
		<QueryClientProvider client={queryClient}>
			<Head>
				<meta name='mobile-web-app-capable' content='yes' />
				<link rel='manifest' href='/manifest.json' />
			</Head>
			<Component {...pageProps} />
		</QueryClientProvider>
	);
}
