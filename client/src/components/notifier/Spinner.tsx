import Image from 'next/image';
import spinner from 'public/YrMx-Spin-1s-200px.gif';

const Spinner = () => {
	return (
		<div className='fixed z-10 -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2'>
			<Image src={spinner} alt='loading spinner' width={100} height={100} />
		</div>
	);
};

export default Spinner;
