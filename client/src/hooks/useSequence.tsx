import _ from 'lodash';
import { useCallback, useEffect, useMemo, useState } from 'react';

import { DEBOUNCE_DELAY, SequenceChar, SEQUENCES } from '~/src/config/settings';

import { useSound } from './useSound';

type SessionLog = {
	init: number;
	touch: number;
	pass: number;
	diff: number;
	error: number;
};

const initialLog: SessionLog = {
	init: 0,
	touch: 0,
	pass: 0,
	diff: 0,
	error: 0,
};

const useSequence = ({
	targetSequence,
	startDest,
	randHold,
}: {
	targetSequence: typeof SEQUENCES[number];
	startDest: SequenceChar[];
	randHold: number;
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
	const [log, setLog] = useState<SessionLog>(initialLog);
	const [isFinished, setIsFinished] = useState(false);
	const [optrTimeout, setOptrTimeout] = useState(0);
	const [finalTouch, setFinalTouch] = useState(0);

	const isLeft = useMemo(() => direction === 'LEFT', [direction]);
	const isParked = useMemo(() => cursor === -1, [cursor]);

	const { playSound } = useSound({ fileName: 'MP_Electronic Chime.mp3', volume: 0.5 });

	const isOperational = useMemo(
		() => !isFinished && Boolean(optrTimeout),
		[isFinished, optrTimeout]
	);

	const distance = useMemo(() => {
		if (type === 'B') {
			if (destination === 'P') return 1;
			if (starting === 'P' && [sequence[0], sequence.at(-1)].includes(destination))
				return 1;
		}
		return Math.abs(indexOfChar(destination) - indexOfChar(starting));
	}, [destination, indexOfChar, sequence, starting, type]);

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
				const loggingCond = isLeft
					? cursor + 1 <= sequence.length - 1
					: cursor - 1 !== -1;

				if (loggingCond) {
					writeLog('touch', Date.now());
					setTravel((prev) => [...prev, 'L']);
				}

				const next = (() => {
					if (!isParked) return cursor + delta;
					if (!isLeft) return 0;
					return sequence.length - 1;
				})();

				moveCursor(next);
			}
		},
		[cursor, isLeft, isOperational, isParked, moveCursor, sequence.length, writeLog]
	);

	const onWheelR = useCallback(
		(e: WheelEvent) => {
			if (!isOperational) return;
			const P = e.deltaY;
			const delta = isLeft ? -1 : 1;
			if (P < 0 || P === 0) {
				const loggingCond = isLeft
					? cursor - 1 !== -1
					: cursor + 1 <= sequence.length - 1;

				if (loggingCond) {
					writeLog('touch', Date.now());
					setTravel((prev) => [...prev, 'R']);
				}

				const next = (() => {
					if (!isParked) return cursor + delta;
					if (!isLeft) return sequence.length - 1;
					return 0;
				})();

				moveCursor(next);
			}
		},
		[cursor, isLeft, isOperational, isParked, moveCursor, sequence.length, writeLog]
	);

	const onParking = useCallback(() => {
		if (!isOperational) return;

		if (!(cursor === -1 && travel.at(-1) === 'P')) {
			writeLog('touch', Date.now());
			setTravel((prev) => [...prev, 'P']);
		}

		setCursor(-1);
	}, [cursor, isOperational, travel, writeLog]);

	const pass = useMemo(
		() =>
			_.debounce(() => {
				setIsFinished(true);
			}, 2000),
		[]
	);

	useEffect(() => {
		if (isOperational) return;

		const timeoutId = setTimeout(() => {
			setOptrTimeout(randHold);
		}, randHold);

		return () => {
			clearTimeout(timeoutId);
		};
	}, [isOperational, randHold]);

	useEffect(() => {
		if (optrTimeout) {
			writeLog('init', Date.now() + DEBOUNCE_DELAY);
		}
	}, [optrTimeout, writeLog]);

	useEffect(() => {
		if (cursor === indexOfChar(destination)) {
			setFinalTouch(Date.now());
			pass();
		} else {
			pass.cancel();
		}
	}, [cursor, destination, pass, indexOfChar]);

	useEffect(() => {
		const dl = _.debounce(onWheelL, DEBOUNCE_DELAY);
		const dr = _.debounce(onWheelR, DEBOUNCE_DELAY);
		const beep = _.debounce(playSound, DEBOUNCE_DELAY);

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

	useEffect(() => {
		if (!isFinished) return;

		const diff = (() => {
			if (distance === 1 && travel.length === 1) return log.touch - log.init;
			return finalTouch - log.init;
		})();

		const error = (() => {
			if (
				((destination === sequence[0] && travel[0] !== 'L') ||
					(destination === sequence.at(-1) && travel[0] !== 'R')) &&
				starting === 'P'
			) {
				return Math.abs(travel.length - distance - 1);
			}
			return Math.abs(travel.length - distance);
		})();

		writeLog('pass', finalTouch);
		writeLog('diff', diff);
		writeLog('error', error);

		// TODO: const offset = travel.length * DEFAULT_DELAY;
	}, [
		destination,
		distance,
		finalTouch,
		isFinished,
		log.init,
		log.touch,
		sequence,
		starting,
		travel,
		writeLog,
	]);

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
