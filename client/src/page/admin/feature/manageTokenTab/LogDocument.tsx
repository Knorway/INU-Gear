import _ from 'lodash';
import { useMemo } from 'react';

import { SessionToken } from '~/src/api/fetcher';
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
	direction: Sequence<'direction'>;
	initialReaction: number;
	responseTime: number;
	sequence: SequenceChar[];
	starting: SequenceChar;
	destination: SequenceChar;
	recordedAt: number;
};

const tableHeads = ['dir', 'initial', 'response', 'starting', 'destination'];

const LogDocument = ({ token, log, onUnmount }: Props) => {
	console.log(log);
	const parsedLog = useMemo(() => {
		return Object.entries(_.groupBy(log, 'type')).reduce((map, [type, log]) => {
			const doc = log.map(
				(e) =>
					({
						direction: e.direction,
						initialReaction: e.initialReaction,
						responseTime: e.responseTime,
						sequence: e.sequence,
						starting: e.starting,
						destination: e.destination,
						recordedAt: e?.log?.pass,
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
						.map(([key, value]) => (
							<div key={key} className='flex flex-col mt-2 space-y-1'>
								<span className='text-3xl font-bold text-black'>
									{key}
								</span>
								{Object.entries(value).map(([key, value]) => (
									<div key={key}>
										<p className='my-2 font-bold text-black'>
											[{key.split(',')}]
										</p>
										<div>
											<Table tableHeads={tableHeads} data={value}>
												{({ data }) => (
													<tr
														key={data.initialReaction}
														className='bg-white border-b cursor-pointer hover:bg-gray-100'
													>
														<td className='w-4'>
															{/* placeholder */}
														</td>
														<td className='px-6 py-1 text-black'>
															{data.direction}
														</td>
														<td
															scope='row'
															className='px-6 py-1 font-normal text-black whitespace-nowrap'
														>
															{data.initialReaction}ms
														</td>
														<td className='px-6 py-1 text-black'>
															{data.responseTime}ms
														</td>
														<td className='px-6 py-1 text-black'>
															{data.starting}
														</td>
														<td className='px-6 py-1 text-black'>
															{data.destination}
														</td>
													</tr>
												)}
											</Table>
										</div>
									</div>
								))}
							</div>
						))}
			</div>
		);
	}, [log?.length, parsedLog]);

	return (
		<Toast
			variant='information'
			className={{ body: 'max-h-[96vh] h-screen' }}
			title={title}
			description={description}
			component={!log ? <Spinner /> : component}
			// component={_.isEmpty(parsedLog) ? <Spinner /> : component}
			onLeave={onUnmount}
		/>
	);
};

export default LogDocument;
