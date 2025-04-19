// TimerCircle.tsx
import { useEffect, useState } from "react";

function TimerCircle({
	duration = 21,
	isPaused = false,
	onTimeout, // Add this prop
}: {
	duration?: number;
	isPaused?: boolean;
	onTimeout?: () => void; // Callback function type
}) {
	const radius = 48;
	const circumference = 2 * Math.PI * radius;
	const [secondsLeft, setSecondsLeft] = useState(duration);
	const [timedOut, setTimedOut] = useState(false); // Prevent multiple calls

	useEffect(() => {
		// Reset timer if duration changes or component remounts with different duration
		setSecondsLeft(duration);
		setTimedOut(false);
	}, [duration]);

	useEffect(() => {
		let interval: NodeJS.Timeout | null = null;

		if (!isPaused && !timedOut) {
			// Only run if not paused and not already timed out
			interval = setInterval(() => {
				setSecondsLeft((prev) => {
					if (prev <= 1) {
						if (interval) clearInterval(interval); // Clear interval immediately
						if (onTimeout && !timedOut) {
							onTimeout(); // Call the callback
							setTimedOut(true); // Mark as timed out
						}
						return 0;
					}
					return prev - 1;
				});
			}, 1000);
		} else if (interval) {
			// Clear interval if paused or timed out
			clearInterval(interval);
		}

		return () => {
			if (interval) clearInterval(interval);
		};
		// Add dependencies: onTimeout and timedOut
	}, [isPaused, onTimeout, timedOut]);

	const progress = (duration - secondsLeft) / duration;

	return (
		<svg
			width="120"
			height="120"
			className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20"
		>
			<title>Timer Progress Circle</title>
			<circle
				r={radius}
				cx="60"
				cy="60"
				fill="transparent"
				stroke="#DD0000"
				strokeWidth="10"
				strokeDasharray={circumference}
				strokeDashoffset={circumference * progress}
				transform="rotate(-90 60 60)"
			/>
		</svg>
	);
}

export default TimerCircle;
