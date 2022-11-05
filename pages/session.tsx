import axios from 'axios';
import dynamic from 'next/dynamic';
import { useEffect } from 'react';

const SessionPage = dynamic(() => import('../src/components/page/SessionPage'), {
	ssr: false,
});

const Page = () => {
	// useEffect(() => {
	// 	(async () => {
	// 		const response = await axios.get('/api/hello');
	// 		console.log(response.data);
	// 	})();
	// }, []);

	return <SessionPage />;
};

export default Page;
