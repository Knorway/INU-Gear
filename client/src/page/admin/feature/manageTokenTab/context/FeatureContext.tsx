import React, { createContext, Reducer, useReducer } from 'react';

type Props = {
	children: React.ReactNode;
};

type State = {
	tokenPage: number;
	hasNext: boolean;
	count: number;
	totalCount: number;
};

const reducer: Reducer<State, Partial<State>> = (prev, cur) => ({ ...prev, ...cur });

export const FeatureStateContext = createContext<State | null>(null);
export const featureDispatchContext = createContext<React.Dispatch<
	Partial<State>
> | null>(null);

export const FeatureContextProvider = (props: Props) => {
	const [state, dispatch] = useReducer(reducer, {
		tokenPage: 0,
		hasNext: false,
	} as State);

	return (
		<FeatureStateContext.Provider value={state}>
			<featureDispatchContext.Provider value={dispatch}>
				{props.children}
			</featureDispatchContext.Provider>
		</FeatureStateContext.Provider>
	);
};
