import axios from 'axios';
import dynamic from 'next/dynamic';
import { Fragment, useEffect, useRef } from 'react';

const SessionPage = dynamic(() => import('../src/components/page/SessionPage'), {
	ssr: false,
});

const Page = () => {
	const sessionId = useRef((Math.random() + 1).toString(16).substring(2));

	useEffect(() => {
		const eventSource = new EventSource(
			`http://localhost:8090/subscribe/${sessionId.current}`
		);
		eventSource.addEventListener('message', (e) => {
			// console.log(JSON.parse(e.data));
			console.log(`${Date.now() - JSON.parse(e.data).timeStamp}ms`);
		});
		eventSource.addEventListener('error', (e) => {
			console.log('error');
		});

		return () => {
			eventSource.close();
		};
	}, []);

	// return <SessionPage />;
	return (
		<Fragment>
			<button
				onClick={(e) => {
					axios.post(`http://localhost:8090/publish/${sessionId.current}`, {
						timeStamp: Date.now(),
					});
				}}
			>
				publish
			</button>
			<SessionPage />
		</Fragment>
	);
};

export default Page;
