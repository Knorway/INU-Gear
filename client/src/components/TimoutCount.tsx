import { useEffect, useState } from 'react';

const TimeoutCount = (props: { timeout: number; isFinished: boolean }) => {
	const [count, setCount] = useState(props.timeout);

	useEffect(() => {
		setCount(props.timeout);
	}, [props.timeout]);

	useEffect(() => {
		// if (!props.isFinished) return;
		const intervalId = setInterval(() => {
			setCount((prev) => prev - 32);
		}, 32);

		return () => {
			clearInterval(intervalId);
		};
	}, [props.isFinished]);

	// if (idx === indexOfChar(destination) && isOperational) return 'crimson';

	// const tintP = useCallback(() => {
	// 	if (!initialized) return 'black';
	// 	if (destination === 'P' && isOperational) return 'crimson';
	// 	return currentCursor === indexOfChar('P') ? 'green' : 'black';
	// }, [currentCursor, destination, indexOfChar, initialized, isOperational]);

	return (
		<div style={{ visibility: count !== 0 ? 'visible' : 'hidden' }}>
			<code>timeout: {count}ms</code>
		</div>

		/* {type === 'B' && (
					<div style={{ display: 'flex', justifyContent: 'center' }}>
						<span
							style={{
								color: tintP(),
								fontSize: '80px',
							}}
						>
							P
						</span>
					</div>
				)} */

		/* <div>
				<p>logging infomation</p>
				<pre>travel: {JSON.stringify(travel)}</pre>
				<pre>distance: {distance}</pre>
				<div>direction: {direction}</div>
				<div>starting: {starting}</div>
				<div>destination: {destination}</div>
				<pre>cursor: {currentCursor}</pre>
				<pre>diff: {log.diff ? `${log.diff}ms` : 'await'}</pre>
				<pre>
					touch:{' '}
					{log.touch! - log.init! ? `${log.touch! - log.init!}ms` : 'await'}
				</pre>
				<TimeoutCount timeout={stepTimeout} isFinished={isFinished} />
			</div> */
	);
};
export default TimeoutCount;
