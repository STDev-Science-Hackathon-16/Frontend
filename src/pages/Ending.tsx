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
	return (
		<div
			className="flex items-center justify-center min-h-screen w-full bg-cover bg-top fixed top-0 left-0 right-0 bottom-0 overflow-hidden"
			style={{ backgroundImage: `url('/bg1.png')` }}
		>
			<h1 className="text-[46px] font-bold select-none">종료</h1>
		</div>
	);
}

export default Ending;
