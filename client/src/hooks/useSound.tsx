import { useCallback } from 'react';

export const useSound = ({ fileName }: { fileName: string }) => {
	const playSound = useCallback(() => {
		const audio = new Audio();
		audio.preload = 'auto';
		audio.src = '/' + fileName;
		audio.play();
	}, [fileName]);

	return { playSound };
};
