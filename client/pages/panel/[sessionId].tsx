import { useRouter } from 'next/router';

const SessionPanel = () => {
	const router = useRouter();

	return <h1>Panel sessionId: {router.query.sessionId}</h1>;
};

export default SessionPanel;
