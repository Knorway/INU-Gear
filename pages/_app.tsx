import '../dist/output.css';

import Head from 'next/head';

import type { AppProps } from 'next/app';

export default function App({ Component, pageProps }: AppProps) {
	return (
		<>
			<Head>
				<meta name='mobile-web-app-capable' content='yes' />
				<link rel='manifest' href='/manifest.json' />
			</Head>
			<Component {...pageProps} />
		</>
	);
}
