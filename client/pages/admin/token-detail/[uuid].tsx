import { useRouter } from 'next/router';

const Page = () => {
	const router = useRouter();

	return <pre>{JSON.stringify(router.pathname)}</pre>;
};

export default Page;
