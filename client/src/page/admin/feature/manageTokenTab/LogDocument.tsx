import { ArrowPathIcon } from '@heroicons/react/24/outline';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import _ from 'lodash';
import { Fragment, useCallback, useMemo } from 'react';

import { mutatation, SessionToken } from '~/src/api/fetcher';
import { queryKey } from '~/src/api/queryClient';
import Spinner from '~/src/components/Spinner';
import Table from '~/src/components/Table';
import Toast from '~/src/components/Toast';
import {
  Sequence,
  SequenceChar,
  SEQUENCES,
  TRIAL_REPEAT,
} from '~/src/config/settings';

type Props = {
	token: SessionToken;
	log: any;
	onUnmount: () => void;
};

type KeyChars = `${SequenceChar},${SequenceChar},${SequenceChar}`;
type ParsedLog = Record<Sequence<'type'>, Record<KeyChars, LogDoc[]>>;
type ValueOf<T> = T[keyof T];
type LogDoc = {
	type: Sequence<'type'>;
	direction: Sequence<'direction'>;
	initialReaction: number;
	responseTime: number;
	sequence: SequenceChar[];
	starting: SequenceChar;
	destination: SequenceChar;
	recordedAt: number;
	uuid: string;
};

const tableHeads = ['dir', 'initial', 'response', 'starting', 'destination'];

const LogDocument = ({ token, log, onUnmount }: Props) => {
	const queryClient = useQueryClient();
	const { mutate: rollbackTrial, isLoading: isRollbackingTrial } = useMutation({
		mutationFn: mutatation.deleteSessionLog,
	});

	const loadable = useMemo(() => !log || isRollbackingTrial, [isRollbackingTrial, log]);

	const parsedLog = useMemo(() => {
		return Object.entries(_.groupBy(log, 'type')).reduce((map, [type, log]) => {
			const doc = log.map(
				(e) =>
					({
						type: e.type,
						direction: e.direction,
						initialReaction: e.initialReaction,
						responseTime: e.responseTime,
						sequence: e.sequence,
						starting: e.starting,
						destination: e.destination,
						recordedAt: e?.log?.pass,
						uuid: e.uuid,
					} as LogDoc)
			);

			map[type as keyof ParsedLog] = _.groupBy(
				doc,
				'sequence'
			) as ValueOf<ParsedLog>;

			return map;
		}, {} as ParsedLog);
	}, [log]);

	const trialChunkDivider = (idx: number) => {
		return (
			idx % TRIAL_REPEAT === 0 && (
				<span className='text-xs font-bold text-black underline uppercase'>
					trial: {idx + 1}
				</span>
			)
		);
	};

	const revokeTrial = useCallback(
		(docs: LogDoc[]) => () => {
			const { direction, sequence, type } = docs[0];

			const confirm = window.confirm(
				`type: [${type}] direction: [${direction}] sequence: [${sequence}] \n해당 트라이얼의 로그 ${docs.length}개를 삭제합니다. \n계속하시겠습니까?`
			);
			if (!confirm) return;

			rollbackTrial(
				{
					tokenId: token.uuid,
					uuids: docs.map((e) => e.uuid),
					sequence: {
						type,
						sequence,
						direction,
						repetition: 1,
					},
				},
				{
					onSuccess: () => {
						queryClient.invalidateQueries({
							queryKey: queryKey.sessionLog(token.uuid),
						});
					},
				}
			);
		},
		[queryClient, rollbackTrial, token.uuid]
	);

	const title = <span className='font-bold'>{token.label}</span>;
	const description = <span className='text-black'>[식별번호] {token.uuid}</span>;
	const component = useMemo(() => {
		return (
			<div className='relative'>
				<span className='text-base text-black'>
					[생성된 로그] {log?.length}/{TRIAL_REPEAT * SEQUENCES.length}{' '}
					[진행률]:{' '}
					{((log?.length / (TRIAL_REPEAT * SEQUENCES.length)) * 100).toFixed(2)}
					%
				</span>
				{!_.isEmpty(parsedLog) &&
					Object.entries(parsedLog)
						.sort((a, b) => (a[0] > b[0] ? 0 : -1))
						.map(([type, logs]) => (
							<div key={type} className='flex flex-col mt-2 space-y-1'>
								<span className='text-3xl font-bold text-black'>
									{type}
								</span>
								{Object.entries(logs).map(([seq, docs]) => {
									const trialChunks = _.groupBy(docs, 'direction');
									return (
										<div key={seq}>
											<p className='my-2 font-bold text-black'>
												[{seq.split(',')}]
											</p>
											<div className='space-y-4'>
												{Object.entries(trialChunks).map(
													([dir, doc]) => (
														<Fragment key={dir}>
															<ArrowPathIcon
																className='p-1 text-black border rounded-md cursor-pointer w-7 h-7'
																onClick={revokeTrial(doc)}
															/>
															<Table
																tableHeads={tableHeads}
																data={doc}
															>
																{({ data }) => (
																	<tr
																		key={
																			data.initialReaction
																		}
																		className='bg-white border-b hover:bg-gray-100'
																	>
																		<td className='w-4'></td>
																		<td className='px-6 py-1 text-black'>
																			{
																				data.direction
																			}
																		</td>
																		<td
																			scope='row'
																			className='px-6 py-1 font-normal text-black whitespace-nowrap'
																		>
																			{
																				data.initialReaction
																			}
																			ms
																		</td>
																		<td className='px-6 py-1 text-black'>
																			{
																				data.responseTime
																			}
																			ms
																		</td>
																		<td className='px-6 py-1 text-black'>
																			{
																				data.starting
																			}
																		</td>
																		<td className='px-6 py-1 text-black'>
																			{
																				data.destination
																			}
																		</td>
																	</tr>
																)}
															</Table>
														</Fragment>
													)
												)}
											</div>
										</div>
									);
								})}
							</div>
						))}
			</div>
		);
	}, [log?.length, parsedLog, revokeTrial]);

	return (
		<Toast
			variant='information'
			className={{ body: 'max-h-[96vh] h-screen' }}
			title={title}
			description={description}
			component={loadable ? <Spinner /> : component}
			onLeave={onUnmount}
		/>
	);
};

export default LogDocument;
