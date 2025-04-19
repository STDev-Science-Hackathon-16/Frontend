import { useImperativeHandle, useRef, useState, forwardRef } from "react";

export type GetRandomArrayHandle = {
	removeIfMatch: (value: number) => void;
};

const generateRandomArray = () =>
	Array.from({ length: 10 }, () => Math.floor(Math.random() * 4));

const GetRandomArray = forwardRef<GetRandomArrayHandle>((_, ref) => {
	const queuesRef = useRef<number[][]>([
		generateRandomArray(),
		generateRandomArray(),
		generateRandomArray(),
	]);
	const [activeIndex, setActiveIndex] = useState(0);
	const [, forceUpdate] = useState(0);

	useImperativeHandle(ref, () => ({
		removeIfMatch: (value: number) => {
			const currentQueue = queuesRef.current[activeIndex];
			if (currentQueue.length > 0 && currentQueue[0] === value) {
				queuesRef.current[activeIndex] = currentQueue.slice(1);
				forceUpdate((n) => n + 1);

				if (queuesRef.current[activeIndex].length === 0) {
					setTimeout(() => {
						setActiveIndex((prev) => prev + 1);
					}, 100);
				}
			}
		},
	}));

	const getImageSrc = (num: number) => {
		switch (num) {
			case 0:
				return "/downhum1.png";
			case 1:
				return "/uphum1.png";
			case 2:
				return "/downtemp1.png";
			case 3:
				return "/uptemp1.png";
			default:
				return "";
		}
	};

	const currentQueue = queuesRef.current[activeIndex] || [];

	return (
		<div className="flex flex-col items-center gap-4 mt-8">
			<div className="flex gap-2">
				{currentQueue.map((num, idx) => (
					<img
						// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
						key={idx}
						src={getImageSrc(num)}
						alt={`queue-${idx}`}
						className="w-12 h-12"
					/>
				))}
			</div>
		</div>
	);
});

export default GetRandomArray;
