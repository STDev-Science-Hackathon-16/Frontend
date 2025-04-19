// getRandomArray.tsx
import { useImperativeHandle, useRef, useState, forwardRef } from "react";

export type GetRandomArrayHandle = {
	removeIfMatch: (value: number) => boolean; // Return true if matched, false otherwise
	getCurrentValue: () => number | null; // Returns the current expected value or null
	isComplete: () => boolean; // Check if all queues are done
};

const generateRandomArray = () =>
	Array.from({ length: 10 }, () => Math.floor(Math.random() * 4));

// Define max queues if needed, e.g., 3 stages
const MAX_QUEUES = 3;

const GetRandomArray = forwardRef<GetRandomArrayHandle>((_, ref) => {
	// Initialize queues only once
	const queuesRef = useRef<number[][] | null>(null);
	if (queuesRef.current === null) {
		queuesRef.current = Array.from({ length: MAX_QUEUES }, generateRandomArray);
	}

	const [activeIndex, setActiveIndex] = useState(0);
	const [, forceUpdate] = useState(0); // Still used to trigger re-render

	useImperativeHandle(ref, () => ({
		removeIfMatch: (value: number) => {
			// Ensure queues and activeIndex are valid
			if (!queuesRef.current || activeIndex >= queuesRef.current.length) {
				return false;
			}
			const currentQueue = queuesRef.current[activeIndex];
			if (currentQueue.length > 0 && currentQueue[0] === value) {
				// Create a new array for the updated queue
				const nextQueue = currentQueue.slice(1);
				queuesRef.current[activeIndex] = nextQueue; // Update the ref

				if (nextQueue.length === 0 && activeIndex < MAX_QUEUES - 1) {
					// Move to next queue after a short delay if current is empty and not the last one
					setTimeout(() => {
						setActiveIndex((prev) => prev + 1);
						// forceUpdate might not be needed here as setActiveIndex triggers re-render
					}, 100); // Delay allows visual confirmation of last item removal
				} else {
					// Force re-render if staying on the same queue but item removed
					forceUpdate((n) => n + 1);
				}
				return true; // Match successful
			}
			return false; // No match or empty queue
		},
		getCurrentValue: () => {
			// Ensure queues and activeIndex are valid
			if (!queuesRef.current || activeIndex >= queuesRef.current.length) {
				return null;
			}
			const currentQueue = queuesRef.current[activeIndex];
			return currentQueue.length > 0 ? currentQueue[0] : null; // Return first item or null if empty
		},
		isComplete: () => {
			// Check if the last queue is processed and empty
			if (!queuesRef.current) return false;
			return (
				activeIndex >= MAX_QUEUES - 1 &&
				queuesRef.current[activeIndex]?.length === 0
			);
		},
	}));

	// Get the current queue safely
	const currentQueue =
		queuesRef.current && activeIndex < queuesRef.current.length
			? queuesRef.current[activeIndex]
			: [];

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

	// Only render if the active index is valid and there are queues
	if (!queuesRef.current || activeIndex >= MAX_QUEUES) {
		// Optionally render a completion message or nothing
		return null;
	}

	return (
		<div className="flex flex-col items-center gap-4 mt-8">
			<div className="flex gap-2 h-12">
				{" "}
				{/* Added fixed height */}
				{currentQueue.map((num, idx) => (
					<img
						// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
						key={`${activeIndex}-${idx}`} // Key needs to be unique across renders/queues
						src={getImageSrc(num)}
						alt={`queue-${activeIndex}-${idx}`}
						className="w-12 h-12 animate-fade-in" // Simple fade-in animation
					/>
				))}
			</div>
		</div>
	);
});

export default GetRandomArray;
