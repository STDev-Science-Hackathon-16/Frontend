import { useEffect, useState } from "react";

function TimerCircle({
	duration = 21,
	isPaused = false,
}: {
	duration?: number;
	isPaused?: boolean;
}) {
	const radius = 48;
	const circumference = 2 * Math.PI * radius;
	const [secondsLeft, setSecondsLeft] = useState(duration);

	useEffect(() => {
		let interval: NodeJS.Timeout | null = null;

		if (!isPaused) {
			interval = setInterval(() => {
				setSecondsLeft((prev) => {
					if (prev <= 1) {
						// biome-ignore lint/style/noNonNullAssertion: <explanation>
						clearInterval(interval!);
						return 0;
					}
					return prev - 1;
				});
			}, 1000);
		}

		return () => {
			if (interval) clearInterval(interval);
		};
	}, [isPaused]);

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
