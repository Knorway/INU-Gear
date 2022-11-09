import { useRouter } from 'next/router';

const SessionDevice = () => {
	const router = useRouter();

	return <h1>Device sessionId: {router.query.sessionId}</h1>;
};

export default SessionDevice;
