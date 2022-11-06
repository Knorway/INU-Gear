import _ from 'lodash';
import { useCallback, useEffect, useMemo, useState } from 'react';

import {
  DEFAULT_DELAY,
  SequenceChar,
  SEQUENCES,
  TIMEOUT_MIN,
  TIMEOUT_RANGE,
  TIMEOUT_UNIT,
} from '../config/settings';
import { rand } from '../utils';

type LogTimeStamps = {
	init?: number;
	touch?: number;
	pass?: number;
	diff?: number;
};

const useSequence = (targetSequence: typeof SEQUENCES[number]) => {
	const { sequence, direction, type } = targetSequence;
	const starting = useMemo(() => sequence[rand(sequence.length)], [sequence]);
	const isLeft = useMemo(() => direction === 'LEFT', [direction]);

	const destination = useMemo(() => {
		const extended = [...new Set(sequence).add('P')];
		let dest = extended[rand(extended.length)];
		while (dest === starting) {
			dest = extended[rand(extended.length)];
		}
		return dest as SequenceChar;
	}, [sequence, starting]);

	const indexOfChar = useCallback(
		(char: SequenceChar) => {
			return sequence.findIndex((e) => e === char);
		},
		[sequence]
	);

	const distance = useMemo(() => {
		if (type === 'B' && destination === 'P') return 1;
		return Math.abs(indexOfChar(destination) - indexOfChar(starting));
	}, [destination, indexOfChar, starting, type]);

	const [travel, setTravel] = useState<('L' | 'R' | 'P')[]>([]);
	const [cursor, setCursor] = useState(indexOfChar(starting));
	const [log, setLog] = useState<LogTimeStamps>({});
	const [isFinished, setIsFinished] = useState(false);
	const [optrTimeout, setOptrTimeout] = useState(0);

	const duringSession = useMemo(
		() => !isFinished && Boolean(optrTimeout),
		[isFinished, optrTimeout]
	);

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
			// if (isFinished) return;
			if (!duringSession) return;
			const P = e.deltaY;
			const delta = isLeft ? 1 : -1;
			if (P > 0) {
				writeLog('touch', Date.now());
				setTravel((prev) => [...prev, 'L']);
				moveCursor(cursor + delta);
			}
		},
		[cursor, duringSession, isLeft, moveCursor, writeLog]
	);

	const onWheelR = useCallback(
		(e: WheelEvent) => {
			// if (isFinished) return;
			if (!duringSession) return;
			const P = e.deltaY;
			const delta = isLeft ? -1 : 1;
			if (P < 0 || P === 0) {
				writeLog('touch', Date.now());
				setTravel((prev) => [...prev, 'R']);
				moveCursor(cursor + delta);
			}
		},
		[cursor, duringSession, isLeft, moveCursor, writeLog]
	);

	const onParking = useCallback(() => {
		// if (isFinished) return;
		if (!duringSession) return;
		writeLog('touch', Date.now());
		setTravel((prev) => [...prev, 'P']);
		if (destination === 'P') {
			setCursor(indexOfChar(destination));
		}
	}, [destination, duringSession, indexOfChar, writeLog]);

	useEffect(() => {
		if (duringSession) return;

		// const timeout = rand(4) * TIMEOUT_UNIT + TIMEOUT_MIN;
		const timeout = rand(TIMEOUT_RANGE) * TIMEOUT_UNIT + TIMEOUT_MIN;
		const timeoutId = setTimeout(() => {
			setOptrTimeout(timeout);
		}, timeout);

		return () => {
			clearTimeout(timeoutId);
		};
	}, [duringSession]);

	useEffect(() => {
		if (optrTimeout) {
			writeLog('init', Date.now() + DEFAULT_DELAY);
		}
	}, [optrTimeout, writeLog]);

	useEffect(() => {
		setIsFinished(cursor === indexOfChar(destination));
	}, [cursor, destination, indexOfChar]);

	useEffect(() => {
		const dl = _.debounce(onWheelL, DEFAULT_DELAY);
		const dr = _.debounce(onWheelR, DEFAULT_DELAY);

		window.addEventListener('wheel', dl);
		window.addEventListener('wheel', dr);

		if (type === 'B') {
			window.addEventListener('mousedown', onParking);
		}

		return () => {
			window.removeEventListener('wheel', dl);
			window.removeEventListener('wheel', dr);
			window.removeEventListener('mousedown', onParking);
		};
	}, [onParking, onWheelL, onWheelR, type]);

	useEffect(() => {
		if (!isFinished) return;

		const finalTouch = Date.now();
		writeLog('pass', finalTouch); // -> ?

		const diff = (() => {
			if (distance === 1 && travel.length === 1) return log.touch! - log.init!;
			return finalTouch - log.init!;
		})();

		writeLog('diff', diff);
	}, [distance, isFinished, log.init, log.touch, travel.length, writeLog]);

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
			duringSession,
		},
		utils: {
			indexOfChar,
		},
	};
};

export default useSequence;
