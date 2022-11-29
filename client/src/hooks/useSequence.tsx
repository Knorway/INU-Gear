import _ from 'lodash';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { DEFAULT_DELAY, SequenceChar, SEQUENCES } from '~/src/config/settings';

import { useSound } from './useSound';

type LogTimeStamps = {
	init: number;
	touch: number;
	pass: number;
	diff: number;
};

const initialTimeStamps: LogTimeStamps = {
	init: 0,
	touch: 0,
	pass: 0,
	diff: 0,
};

const useSequence = ({
	targetSequence,
	startDest,
}: {
	targetSequence: typeof SEQUENCES[number];
	startDest: SequenceChar[];
}) => {
	const { sequence, direction, type } = targetSequence;
	const [starting, destination] = startDest;

	const indexOfChar = useCallback(
		(char: SequenceChar) => {
			return sequence.findIndex((e) => e === char);
		},
		[sequence]
	);

	const [travel, setTravel] = useState<('L' | 'R' | 'P')[]>([]);
	const [cursor, setCursor] = useState(indexOfChar(starting));
	const [log, setLog] = useState<LogTimeStamps>(initialTimeStamps);
	const [isFinished, setIsFinished] = useState(false);
	const [optrTimeout, setOptrTimeout] = useState(0);

	const initRef = useRef(false);
	const isLeft = useMemo(() => direction === 'LEFT', [direction]);

	const { playSound } = useSound({ fileName: 'beep-sound-8333.mp3' });

	const isOperational = useMemo(
		() => !isFinished && Boolean(optrTimeout),
		[isFinished, optrTimeout]
	);

	const distance = useMemo(() => {
		if (type === 'B' && destination === 'P') return 1;
		return Math.abs(indexOfChar(destination) - indexOfChar(starting));
	}, [destination, indexOfChar, starting, type]);

	const writeLog = useCallback((key: keyof typeof log, value: number) => {
		setLog((prev) => {
			if (!prev[key]) return { ...prev, [key]: value };
			return prev;
		});
	}, []);

	const moveCursor = useCallback(
		(value: number) => {
			if (value < 0 || value > sequence.length - 1) return;
			setCursor(value);
		},
		[sequence.length]
	);

	const onWheelL = useCallback(
		(e: WheelEvent) => {
			if (!isOperational) return;
			const P = e.deltaY;
			const delta = isLeft ? 1 : -1;
			if (P > 0) {
				writeLog('touch', Date.now());
				setTravel((prev) => [...prev, 'L']);
				moveCursor(cursor + delta);
			}
		},
		[cursor, isLeft, isOperational, moveCursor, writeLog]
	);

	const onWheelR = useCallback(
		(e: WheelEvent) => {
			if (!isOperational) return;
			const P = e.deltaY;
			const delta = isLeft ? -1 : 1;
			if (P < 0 || P === 0) {
				writeLog('touch', Date.now());
				setTravel((prev) => [...prev, 'R']);
				moveCursor(cursor + delta);
			}
		},
		[cursor, isLeft, isOperational, moveCursor, writeLog]
	);

	const onParking = useCallback(() => {
		if (!isOperational) return;
		writeLog('touch', Date.now());
		setTravel((prev) => [...prev, 'P']);
		if (destination === 'P') {
			setCursor(indexOfChar(destination));
		}
	}, [isOperational, writeLog, destination, indexOfChar]);

	const pass = useMemo(
		() =>
			_.debounce(() => {
				setIsFinished(true);
			}, 2000),
		[]
	);

	useEffect(() => {
		if (isOperational) return;

		const timeout = !initRef.current ? 5000 + 1000 * 4.5 : 1000 * 4.5;
		initRef.current = true;
		const timeoutId = setTimeout(() => {
			setOptrTimeout(timeout);
		}, timeout);

		return () => {
			clearTimeout(timeoutId);
		};
	}, [isOperational]);

	useEffect(() => {
		if (optrTimeout) {
			writeLog('init', Date.now() + DEFAULT_DELAY);
		}
	}, [optrTimeout, writeLog]);

	const [finalTouch, setFinalTouch] = useState(0);

	useEffect(() => {
		if (cursor === indexOfChar(destination)) {
			setFinalTouch(Date.now());
			pass();
		} else {
			pass.cancel();
		}
	}, [cursor, destination, pass, indexOfChar]);

	console.log(finalTouch);

	useEffect(() => {
		const dl = _.debounce(onWheelL, DEFAULT_DELAY);
		const dr = _.debounce(onWheelR, DEFAULT_DELAY);
		const beep = _.debounce(playSound, DEFAULT_DELAY);

		window.addEventListener('wheel', dl);
		window.addEventListener('wheel', dr);
		window.addEventListener('wheel', beep);

		if (type === 'B') {
			window.addEventListener('mousedown', beep);
			window.addEventListener('mousedown', onParking);
		}

		return () => {
			window.removeEventListener('wheel', dl);
			window.removeEventListener('wheel', dr);
			window.removeEventListener('wheel', beep);

			window.removeEventListener('mousedown', beep);
			window.removeEventListener('mousedown', onParking);
		};
	}, [onParking, onWheelL, onWheelR, playSound, type]);

	// useEffect(() => {
	// 	if (!isFinished) return;

	// 	const finalTouch = Date.now();
	// 	writeLog('pass', finalTouch); // -> ?

	// 	const diff = (() => {
	// 		if (distance === 1 && travel.length === 1) return log.touch - log.init;
	// 		return finalTouch - log.init;
	// 	})();

	// 	writeLog('diff', diff);
	// }, [distance, isFinished, log.init, log.touch, travel.length, writeLog]);

	useEffect(() => {
		if (!isFinished) return;

		writeLog('pass', finalTouch);

		// TODO
		// const offset = travel.length * DEFAULT_DELAY;;

		const diff = (() => {
			if (distance === 1 && travel.length === 1) return log.touch - log.init;
			return finalTouch - log.init;
		})();

		writeLog('diff', diff);
	}, [distance, finalTouch, isFinished, log.init, log.touch, travel.length, writeLog]);

	return {
		cursor: {
			current: cursor,
			starting,
			destination,
		},
		sequence: {
			chars: sequence,
			type,
			direction,
		},
		info: {
			distance,
			travel,
			isFinished,
			log,
			isOperational,
		},
		utils: {
			indexOfChar,
		},
	};
};

export default useSequence;
