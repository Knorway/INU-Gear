import { useCallback } from 'react';

export const useSound = ({
	fileName,
	volume = 1,
}: {
	fileName: string;
	volume?: number;
}) => {
	const playSound = useCallback(() => {
		// const audio = new Audio();
		// audio.preload = 'auto';
		// audio.src = '/' + fileName;
		// audio.volume = volume;
		// audio.play();

		const audio = amplifyMedia(new Audio(), 2);
		audio.media.preload = 'auto';
		audio.media.src = '/' + fileName;
		audio.media.volume = volume;
		audio.media.play();
	}, [fileName, volume]);

	return { playSound };
};

const amplifyMedia = (mediaElem: HTMLAudioElement, multiplier: number) => {
	const context = new (window.AudioContext || (window as any)?.webkitAudioContext)();
	const result = {
		context,
		source: context.createMediaElementSource(mediaElem),
		gain: context.createGain(),
		media: mediaElem,
		amplify: (multiplier: number) => {
			result.gain.gain.value = multiplier;
		},
		getAmpLevel: () => {
			return result.gain.gain.value;
		},
	};
	result.source.connect(result.gain);
	result.gain.connect(context.destination);
	result.amplify(multiplier);
	return result;
};
