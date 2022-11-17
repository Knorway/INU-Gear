import _ from 'lodash';

import { SEQUENCES } from '../config/settings';

export const rand = (range: number) => _.random(0, range - 1);

export const filterCandidates = (sequence?: typeof SEQUENCES) => {
	if (!sequence || sequence.length < 2) return [];

	let cap = 0;
	for (let i = 2; i <= sequence.length; i++) {
		cap = i - 1 + cap;
	}

	const result = new Set();
	while (result.size !== cap) {
		const starting = sequence[rand(sequence.length)];
		let dest = sequence[rand(sequence.length)];
		while (starting === dest) {
			dest = sequence[rand(sequence.length)];
		}

		const candidate = `${starting}-${dest}`;
		if (
			!result.has(candidate) &&
			!result.has(candidate.split('-').reverse().join('-'))
		) {
			result.add(candidate);
		}
	}

	return [...result] as Array<string>;
};
