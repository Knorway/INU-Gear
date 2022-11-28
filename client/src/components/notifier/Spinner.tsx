import Image from 'next/image';
import spinner from 'public/YrMx-Spin-1s-200px.gif';

const Spinner = () => {
	return (
		<div className='fixed z-10 flex items-center justify-center w-full h-full'>
			<Image src={spinner} alt='loading spinner' width={100} height={100} />
		</div>
	);
};

export default Spinner;
