import _ from 'lodash';
import { useRouter } from 'next/router';
import { Fragment, useState } from 'react';

import { SessionToken } from '~/src/api/fetcher';
import { REPETITION_LIMIT, SEQUENCES } from '~/src/config/settings';

type Props = {
	sessionToken?: SessionToken;
};

const SequenceGrid = ({ sessionToken }: Props) => {
	const router = useRouter();

	const overRepeated = (repetition: number) => repetition >= REPETITION_LIMIT;

	const navigate = (sequence: typeof SEQUENCES[number]) => () => {
		if (!sessionToken) return;
		router.push({
			pathname: `/device/[sessionId]`,
			query: {
				sessionId: sessionToken.uuid,
				sequence: JSON.stringify(sequence),
			},
		});
	};

	if (!sessionToken || !sessionToken.sequence) return null;

	return (
		<Fragment>
			{Object.entries(_.groupBy(sessionToken.sequence, 'type')).map(
				([key, groupSequences]) => (
					<div key={key} className='m-4 space-y-4'>
						<h1 className='text-4xl font-bold text-center'>{key}</h1>
						<div className='flex space-x-4'>
							{groupSequences.map((sequence, idx) => (
								<div
									key={idx}
									className={`flex-1 p-1 border ${
										overRepeated(sequence.repetition)
											? 'cursor-not-allowed bg-green-500'
											: 'cursor-pointer bg-inherit'
									}`}
									{...(!overRepeated(sequence.repetition) && {
										onClick: navigate(sequence),
									})}
								>
									<div className='relative'>
										<img
											src={`/${
												sequence.type
											}_${sequence.sequence.join('')}(${
												sequence.direction
											}).png`}
											alt='gear'
										/>
										{overRepeated(sequence.repetition) && (
											<PassMark />
										)}
									</div>
								</div>
							))}
						</div>
					</div>
				)
			)}
		</Fragment>
	);
};

const PassMark = () => {
	return (
		<span className='absolute top-0 p-2 text-3xl font-bold text-green-600 -translate-x-1/2 bg-white border left-1/2'>
			PASS
		</span>
	);
};

export default SequenceGrid;
