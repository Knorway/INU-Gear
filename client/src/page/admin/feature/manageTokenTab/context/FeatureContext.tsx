import React, { createContext, Reducer, useReducer } from 'react';

type Props = {
	children: React.ReactElement;
};

type State = {
	checkedToken: string[];
};

const reducer: Reducer<State, State> = (prev, cur) => ({ ...prev, ...cur });

export const FeatureStateContext = createContext<State | null>(null);
export const featureDispatchContext = createContext<React.Dispatch<State> | null>(null);

export const PageContextProvider = (props: Props) => {
	const [state, dispatch] = useReducer(reducer, {
		checkedToken: [],
	} as State);

	return (
		<FeatureStateContext.Provider value={state}>
			<featureDispatchContext.Provider value={dispatch}>
				{props.children}
			</featureDispatchContext.Provider>
		</FeatureStateContext.Provider>
	);
};
