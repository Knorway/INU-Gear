import { SessionToken } from '~/src/api/fetcher';
import Accordion from '~/src/components/Accordion';

type Props = {
	token: SessionToken;
};

const SessionTokenLogTable = ({ token }: Props) => {
	return (
		<div className='flex flex-col'>
			<Accordion
				text={{
					button: `${token.label} - ${token.uuid}`,
					panel: <pre>{JSON.stringify(token, null, 2)}</pre>,
				}}
				className={{ button: 'max-w-max p-2 rounded-md border', panel: '' }}
			/>
		</div>
	);
};

export default SessionTokenLogTable;
