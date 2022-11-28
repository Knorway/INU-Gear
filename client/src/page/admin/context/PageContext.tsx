import React, { createContext, Reducer, useReducer } from 'react';

import { TabName } from '../config/tab';

type Props = {
	children: React.ReactElement;
};

type State = {
	currentTab: TabName;
};

const reducer: Reducer<State, State> = (prev, cur) => ({ ...prev, ...cur });

export const PageStateContext = createContext<State | null>(null);
export const PageDispatchContext = createContext<React.Dispatch<State> | null>(null);

export const PageContextProvider = (props: Props) => {
	const [state, dispatch] = useReducer(reducer, {
		currentTab: 'overview',
	} as State);

	return (
		<PageStateContext.Provider value={state}>
			<PageDispatchContext.Provider value={dispatch}>
				{props.children}
			</PageDispatchContext.Provider>
		</PageStateContext.Provider>
	);
};
