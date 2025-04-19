import { useBreadStore } from "@/stores/useBreadStore";

function Ending() {
	const {
		bread,
		time,
		temperature,
		tap,
		quiz,
		bakeTem,
		bakeHum,
		dieFlag,
		step,
		score,
	} = useBreadStore();

	const getBreadImage = () => {
		if (bread != null) if (bread === "치아바타") return "/ciabatta.png";
		if (bread === "포카치아") return "/focaccia.png";
		return "/sourdough.png";
	};

	return (
		<div
			className="flex items-center justify-center min-h-screen w-full bg-cover bg-top fixed top-0 left-0 right-0 bottom-0 overflow-hidden"
			style={{ backgroundImage: `url('/bg1.png')` }}
		>
			<img
				src="/complete.png"
				alt="완성"
				className="absolute top-[15%] left-[15%] w-[30%] m-4"
			/>
			<img
				src="/dish.png"
				alt="접시"
				className="absolute top-[25%] left-[7%] w-[30%] m-4"
			/>
		</div>
	);
}

export default Ending;
