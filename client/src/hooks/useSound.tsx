import { useCallback } from 'react';

// TODO: 이게 훅일 필요가 있나
export const useSound = ({ fileName }: { fileName: string }) => {
	const playSound = useCallback(() => {
		const audio = new Audio();
		audio.preload = 'auto';
		audio.src = '/' + fileName;
		audio.play();
	}, [fileName]);

	return { playSound };
};
