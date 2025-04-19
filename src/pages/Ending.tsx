import { useBreadStore } from "@/stores/useBreadStore";
import { useNavigate } from "react-router-dom";

function Ending() {
	const navigate = useNavigate();
	const { bread, time, temperature, tap, quiz, bakeTem, bakeHum, score } =
		useBreadStore();

	const getBreadImage = () => {
		if (bread != null) if (bread === "치아바타") return "/ciabatta.png";
		if (bread === "포카치아") return "/focaccia.png";
		return "/sourdough.png";
	};

	const handleHomeClick = () => {
		navigate("/");
	};

	return (
		<div
			className="flex items-center justify-center min-h-screen w-full bg-cover bg-top fixed top-0 left-0 right-0 bottom-0 overflow-hidden"
			style={{ backgroundImage: `url('/bg1.png')` }}
		>
			<img
				src="/complete.png"
				alt="완성"
				className="absolute top-[12%] left-[15%] w-[18%] m-4"
			/>
			<img
				src="/dish.png"
				alt="접시"
				className="absolute top-[22%] left-[7%] w-[35%] m-4"
			/>
			<img
				src={getBreadImage()}
				alt="빵"
				className="absolute top-[35%] left-[12%] w-[25%] m-4"
			/>
			<div className="absolute top-[35%] right-[5%] w-[50%] h-[auto] transform -translate-y-1/2">
				<div className="relative w-full h-full">
					<img
						src="/result.png"
						alt="결과 배경"
						className="w-full h-auto object-contain" // Use h-auto for dynamic height based on content
					/>
					<div className="absolute top-[50%] left-[5%] transform -translate-y-1/2 text-black px-4 text-left w-full leading-relaxed text-base sm:text-lg md:text-xl lg:text-2xl">
						<br />
						1차 발효시 온도 : {temperature}
						<br />
						1차 발효시 시간 : {time} <br />
						성형 터치 횟수 : {tap} <br />
						2차 발효 퀴즈 : {quiz} <br />
						베이킹 시 온도 : {bakeTem} <br />
						베이킹 시 습도 : {bakeHum} <br />
						점수 : {score} <br /> <br />
					</div>
				</div>
			</div>
			<div className="absolute bottom-[5%] right-[5%] w-[50%] h-[auto] transform -translate-y-1/2">
				<div className="relative w-full h-full">
					<img
						src="/feedback.png"
						alt="피드백 배경"
						className="w-full h-auto object-contain" // Use h-auto for dynamic height based on content
					/>
					<div className="absolute top-[50%] left-[5%] transform -translate-y-1/2 text-black px-4 text-left w-full leading-relaxed text-base sm:text-lg md:text-xl lg:text-2xl">
						<br />💡 과학적 피드백: 10도 이하, 45도 이상에서 효모가
						비활성화되며,
						<br /> 발효가 일어나지 않음. 효모는 25~30도에서 가장 잘 작동합니다.{" "}
						<br /> <br />
					</div>
				</div>
			</div>
			<button
				type="button"
				onClick={handleHomeClick}
				className="absolute bottom-[5%] right-[5%] w-[20%] h-[12%] bg-[url('/homebtn.png')] bg-contain bg-no-repeat bg-center bg-transparent p-0 border-none z-20"
			/>
		</div>
	);
}

export default Ending;
