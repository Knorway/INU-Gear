// @ts-nocheck
import { ArrowPathIcon } from '@heroicons/react/24/outline';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import _ from 'lodash';
import { Fragment, useCallback, useMemo } from 'react';

import { mutatation, SessionToken } from '~/src/api/fetcher';
import { queryKey } from '~/src/api/queryClient';
import Spinner from '~/src/components/Spinner';
import Table from '~/src/components/Table';
import Toast from '~/src/components/Toast';
import { Sequence, SequenceChar, SEQUENCES, TRIAL_REPEAT } from '~/src/config/settings';

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
	error: number;
	sequence: SequenceChar[];
	starting: SequenceChar;
	destination: SequenceChar;
	createdAt: number;
	uuid: string;
};

const genderMap = { [-1]: '알수없음', 1: '남', 2: '여', 3: '기타' };
const experienceMap = { [-1]: '알수없음' };

const tableHeads = ['dir', 'starting', 'destination', 'response', 'error'];
const aggTableHeads = ['aggregate', 'response', 'error'];

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
						error: e.error,
						sequence: e.sequence,
						starting: e.starting,
						destination: e.destination,
						createdAt: e.createdAt,
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

	const title = <span className='font-bold'>{token.label} </span>;
	const description = <span className='text-black'>[식별번호] {token.uuid}</span>;
	const component = useMemo(() => {
		return (
			<div className='relative'>
				<span className='text-base text-black'>
					[성별] {genderMap[token.gender]} [운전숙련도]{' '}
					{experienceMap[token.experience]
						? experienceMap[token.experience]
						: token.experience}{' '}
				</span>
				<span className='text-base text-black'>
					<br />
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
													([dir, doc]) => {
														const avgResponse =
															doc.reduce((acc, val) => {
																acc += val.responseTime;
																return acc;
															}, 0) / doc.length;
														const avgError =
															doc.reduce((acc, val) => {
																return acc + val.error;
															}, 0) / doc.length;
														const sumError = doc.reduce(
															(acc, val) => {
																acc += val.error;
																return acc;
															},
															0
														);
														const sumResponse = doc.reduce(
															(acc, val) => {
																return (
																	acc + val.responseTime
																);
															},
															0
														);
														return (
															<Fragment key={dir}>
																<ArrowPathIcon
																	className='p-1 text-black border rounded-md cursor-pointer w-7 h-7'
																	onClick={revokeTrial(
																		doc
																	)}
																/>
																<Table
																	tableHeads={
																		aggTableHeads
																	}
																	data={[
																		{
																			tag: 'AVG',
																			error: avgError
																				? avgError.toFixed(
																						2
																				  )
																				: 0,
																			response:
																				avgResponse.toFixed(
																					0
																				) + 'ms',
																		},
																		{
																			tag: 'SUM',
																			error: sumError,
																			response:
																				(
																					sumResponse /
																					1000
																				)
																					.toFixed(
																						2
																					)
																					.toString() +
																				's',
																		},
																	]}
																>
																	{({ data }) => (
																		<>
																			<tr>
																				<td className='w-4'></td>
																				<td className='px-6 py-1 text-black'>
																					{
																						data.tag
																					}
																				</td>
																				<td className='px-6 py-1 text-black'>
																					{
																						data.response
																					}
																				</td>
																				<td className='px-6 py-1 text-black'>
																					{
																						data.error
																					}
																				</td>
																			</tr>
																		</>
																	)}
																</Table>
																<Table
																	tableHeads={
																		tableHeads
																	}
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
																					data.starting
																				}
																			</td>
																			<td className='px-6 py-1 text-black'>
																				{
																					data.destination
																				}
																			</td>
																			<td className='px-6 py-1 text-black'>
																				{
																					data.responseTime
																				}
																				ms
																			</td>
																			<td className='px-6 py-1 text-black'>
																				{
																					data.error
																				}
																			</td>
																		</tr>
																	)}
																</Table>
															</Fragment>
														);
													}
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
