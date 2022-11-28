import _ from 'lodash';
import { useRouter } from 'next/router';
import { Fragment, useCallback, useState } from 'react';

import { SessionToken } from '~/src/api/fetcher';
import { REPETITION_LIMIT, SEQUENCES } from '~/src/config/settings';

type Props = {
	sessionToken?: SessionToken;
};

const SequenceGrid = ({ sessionToken }: Props) => {
	const router = useRouter();

	const overRepeated = (repetition: number) => repetition >= REPETITION_LIMIT;

	const navigate = (seqeunce: typeof SEQUENCES[number]) => () => {
		if (!sessionToken) return;
		router.push({
			pathname: `/device/[sessionId]`,
			query: {
				sessionId: sessionToken.uuid,
				sequence: JSON.stringify(seqeunce),
			},
		});
	};

	if (!sessionToken || !sessionToken.sequence) return null;

	return (
		<Fragment>
			{Object.entries(_.groupBy(sessionToken.sequence, 'type')).map(
				([key, groupSequences]) => {
					return (
						<div key={key} className='m-4 space-y-4'>
							<h1 className='text-4xl font-bold text-center'>{key}</h1>
							<div className='flex space-x-4'>
								{groupSequences.map((sequence, idx) => (
									<div
										key={idx}
										className={`flex-1 p-1 border ${
											overRepeated(sequence.repetition)
												? 'cursor-not-allowed bg-gray-200'
												: 'cursor-pointer bg-inherit'
										}`}
										{...(!overRepeated(sequence.repetition) && {
											onClick: navigate(sequence),
										})}
									>
										<pre>{JSON.stringify(sequence, null, 2)}</pre>
									</div>
								))}
							</div>
						</div>
					);
				}
			)}
		</Fragment>
	);
};

export default SequenceGrid;
