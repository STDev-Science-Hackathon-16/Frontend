import { useEffect, useImperativeHandle, useState, forwardRef } from "react";

export type GetRandomArrayHandle = {
	removeIfMatch: (value: number) => void;
};

const GetRandomArray = forwardRef<GetRandomArrayHandle>((_, ref) => {
	const [images, setImages] = useState<number[]>([]);

	useImperativeHandle(ref, () => ({
		removeIfMatch: (value: number) => {
			setImages((prev) => {
				if (prev.length > 0 && prev[0] === value) {
					return prev.slice(1);
				}
				return prev;
			});
		},
		getFirst: () => {
			return images.length > 0 ? images[0] : null;
		},
	}));

	useEffect(() => {
		const randoms = Array.from({ length: 10 }, () =>
			Math.floor(Math.random() * 4),
		);
		setImages(randoms);
	}, []);

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

	// 💡 부모에서 호출할 함수 노출
	useImperativeHandle(ref, () => ({
		removeIfMatch: (value: number) => {
			setImages((prev) => {
				if (prev.length > 0 && prev[0] === value) {
					return prev.slice(1);
				}
				return prev;
			});
		},
	}));

	return (
		<div className="flex gap-2 items-center justify-center mt-8">
			{images.map((num, idx) => (
				<img
					// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
					key={idx}
					src={getImageSrc(num)}
					alt={`img-${idx}`}
					className="w-12 h-12"
				/>
			))}
		</div>
	);
});

export default GetRandomArray;
