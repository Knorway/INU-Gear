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

// TODO: wrapper 만들어서 state만 props로 넘기면 간단하게 context 뽑아낼 수 있게 만들 수 있을 거 같은데
export const PageContextProvider = (props: Props) => {
	const [state, dispatch] = useReducer(reducer, {
		currentTab: 'manageToken',
	} as State);

	return (
		<PageStateContext.Provider value={state}>
			<PageDispatchContext.Provider value={dispatch}>
				{props.children}
			</PageDispatchContext.Provider>
		</PageStateContext.Provider>
	);
};
