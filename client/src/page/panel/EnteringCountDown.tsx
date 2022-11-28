import { useCountDown } from '~/src/hooks/useCountDown';

const EnteringCountDown = () => {
	const { count } = useCountDown({ duration: 5, delay: 1000 });

	return (
		<div className='flex items-center justify-center w-full h-screen'>
			<h1 className='text-8xl bold'>{count}</h1>
		</div>
	);
};

export default EnteringCountDown;
