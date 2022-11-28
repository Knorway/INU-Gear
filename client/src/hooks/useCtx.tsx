import React, { useContext } from 'react';

export const useCtx = <T,>(context: React.Context<T>) => {
	const value = useContext(context);
	if (!value) {
		throw new Error('error retrieving value from context');
	}
	return value;
};
