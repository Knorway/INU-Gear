import _ from 'lodash';

import { Sequence, SequenceChar } from '../config/settings';

export const rand = (range: number) => _.random(0, range - 1);

export const checkExcludedUrl = (url: string, excluded: string[]) => {
	return !excluded.includes(url.split('/').filter(Boolean)[0]);
};

export const generateStartDest = (sequence?: Sequence<'sequence'>) => {
	if (!sequence || sequence.length < 2) return [];

	const extended = [...new Set(sequence).add('P')];
	const result = new Set<string>();
	let cap = 0;

	for (let i = 2; i <= extended.length; i++) {
		cap = i - 1 + cap;
	}

	while (result.size !== cap * 2) {
		const starting = extended[rand(extended.length)];
		let dest = extended[rand(extended.length)];

		while (starting === dest) {
			dest = extended[rand(extended.length)];
		}

		const candidate = `${starting}-${dest}`;
		result.add(candidate);
	}

	return [...result].map((e) => e.split('-')) as Array<SequenceChar[]>;
};

export const deduplicate = (gen: ReturnType<typeof generateStartDest>) => {
	let result = _.shuffle(gen.concat(gen));
	while (
		result.some(
			(e, idx) => idx < result.length - 1 && e.join('') === result[idx + 1].join('')
		)
	) {
		result = _.shuffle(gen.concat(gen));
	}
	return result;
};
