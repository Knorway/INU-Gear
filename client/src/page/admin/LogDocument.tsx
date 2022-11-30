import _ from 'lodash';
import { useMemo } from 'react';

import { SessionToken } from '~/src/api/fetcher';
import Toast from '~/src/components/Toast';
import { Sequence, SequenceChar } from '~/src/config/settings';

type Props = {
	token: SessionToken;
	log: any;
	onUnmount: () => void;
};

type KeyChars = `${SequenceChar},${SequenceChar},${SequenceChar}`;
type ParsedLog = Record<Sequence<'type'>, Record<KeyChars, SessionToken[]>>;
type ValueOf<T> = T[keyof T];

const LogDocument = ({ token, log, onUnmount }: Props) => {
	const parsedLog = useMemo(() => {
		return Object.entries(_.groupBy(log, 'type')).reduce((map, [type, log]) => {
			map[type as keyof ParsedLog] = _.groupBy(
				log,
				'sequence'
			) as ValueOf<ParsedLog>;
			return map;
		}, {} as ParsedLog);
	}, [log]);

	const title = <span className='font-bold'>{token.label}</span>;
	const description = <span className='text-black'>{token.uuid}</span>;
	const component = (
		<div className='relative'>
			<span className='text-black'>생성된 로그: {log?.length}</span>
			{!_.isEmpty(parsedLog) && <pre>{JSON.stringify(parsedLog, null, 2)}</pre>}
		</div>
	);

	return (
		<Toast
			variant='information'
			className={{ body: 'max-h-[96vh] h-screen' }}
			title={title}
			description={description}
			component={component}
			onLeave={onUnmount}
		/>
	);
};

export default LogDocument;
