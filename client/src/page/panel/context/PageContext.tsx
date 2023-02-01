import React, { createContext, Reducer, useReducer } from 'react';

import { MessageStream } from '~/src/config/settings';

type PanelState = Omit<MessageStream, 'message'> & {
	message: MessageStream['message'] | null;
};

type Props = {
	children: React.ReactElement;
};

type State = PanelState & {};

const reducer: Reducer<State, State> = (prev, cur) => ({ ...prev, ...cur });

export const PageStateContext = createContext<State | null>(null);
export const PageDispatchContext = createContext<React.Dispatch<State> | null>(null);

export const PageContextProvider = (props: Props) => {
	const [state, dispatch] = useReducer(reducer, {
		complete: false,
		error: false,
		message: null,
	} as State);

	return (
		<PageStateContext.Provider value={state}>
			<PageDispatchContext.Provider value={dispatch}>
				{props.children}
			</PageDispatchContext.Provider>
		</PageStateContext.Provider>
	);
};
