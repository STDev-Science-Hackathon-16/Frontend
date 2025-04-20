import { useGameIdStore } from "@/stores/useGameIdStore";
import { useTokenStore } from "@/stores/useTokenStore";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useFailStore } from "@/stores/useFailStore";

function Shaping() {
	const { setFail } = useFailStore();
	const token = useTokenStore((state) => state.token);
	const gameId = useGameIdStore((state) => state.gameId);
	const yeastMessage = [
		"반죽을 클릭해주세요!",
		"더 클릭해주세요",
		"더 클릭해도 될 것 같아요!",
		"그만 클릭해도 될 것 같아요!",
	];
	const getMessage = () => {
		if (doughcatClickCount >= 35) return yeastMessage[3];
		if (doughcatClickCount >= 30) return yeastMessage[2];
		if (doughcatClickCount >= 20) return yeastMessage[2];
		if (doughcatClickCount >= 10) return yeastMessage[1];
		return yeastMessage[0];
	};
	const [showTutorial, setShowTutorial] = useState(true);

	const [doughcatClickCount, setDoughcatClickCount] = useState(0);
	const navigate = useNavigate();

	const getDoughcatImage = () => {
		if (doughcatClickCount >= 40) return "/doughcat4.png";
		if (doughcatClickCount >= 30) return "/doughcat3.png";
		if (doughcatClickCount >= 20) return "/doughcat2.png";
		if (doughcatClickCount >= 10) return "/doughcat1.png";
		return "/dough2.png";
	};

	const handleDoughcatClick = () => {
		setDoughcatClickCount((prev) => prev + 1);
	};

	const handleNextClick = async () => {
		try {
			const response = await fetch(
				"http://54.180.191.123:8080/api/game/step3",
				{
					method: "POST",
					credentials: "include",
					headers: {
						"Content-Type": "application/json",
						"X-USER-ID": token?.toString() || "",
					},
					body: JSON.stringify({
						gameId: gameId,
						tap: doughcatClickCount,
					}),
				},
			);

			const result = await response.json();

			if (result.data?.reward?.trim()) {
				toast(result.data.reward.trim(), {
					icon: "🎉",
				});
			}

			if (result.status === "success" && result.data.pass === true) {
				navigate("/secondary");
			} else if (result.status === "success" && result.data.pass === false) {
				setFail({
					fail: 2,
					failMessage: result.data.message,
				});
				navigate("/fail");
			}
		} catch (error) {
			console.error("Error during validation:", error);
		}
	};

	return (
		<div
			className="flex items-center justify-center min-h-screen w-full bg-cover bg-center fixed top-0 left-0 right-0 bottom-0 overflow-hidden"
			style={{ backgroundImage: `url('/bg1.png')` }}
		>
			{showTutorial && (
				<div className="fixed inset-0 bg-black bg-opacity-80 z-50 flex flex-col items-center justify-center text-white px-6">
					<div className="mx-auto p-4 text-xl leading-relaxed">
						1차 발효로 형성된 기포와 구조는 불안정해요!
						<br />
						<br /> 그래서 반죽의 표면을 매끄럽게 다듬고 내부 기포의 크기를
						조절하는 성형 과정이 들어가요.
						<br />
						<br />
						성형하고 다시 한 번 발효를 하면, 더 섬세하고 균일한 기포망이
						완성되죠.
						<br />
						<br /> 이 과정을 거쳐야 빵이 예쁘고 맛있게 부풀 수 있어요.
						<br />
						<br /> 반죽을 토닥토닥~ 예쁘게 다듬어줄 거예요.
						<br />
						<br /> 너무 많이 만지면 부풀지 않고, 너무 적게 만지면 규칙적이지
						않게 부풀겠죠?
						<br />
						<br /> 도우냥의 섬세한 손길을 보여줄 때예요!
					</div>
					<button
						type="button"
						onClick={() => setShowTutorial(false)}
						className="absolute bottom-8 right-8 w-[200px] h-[60px] bg-[url('/nextbtn.png')] bg-contain bg-no-repeat bg-center bg-transparent p-0 border-none z-20"
					/>
				</div>
			)}
			<div className="absolute top-8 left-8 right-8 flex justify-between items-start z-20">
				<div className="flex items-center gap-2">
					<div>
						<img
							src="/Rectangle1527.png"
							alt="frame"
							className="absolute top-[16%] left-[0%] w-[5%] transform -translate-y-1/2 z-30"
						/>
						<img
							src="/normalyeast.png"
							alt="character"
							className="absolute top-[16%] left-[0%] w-[5%] transform -translate-y-1/2 z-30"
						/>
					</div>
					<div className="bg-amber-500 px-4 py-2 rounded-2xl font-bold text-white absolute top-[16%] left-[5%] w-[20%] transform -translate-y-1/2 z-30 whitespace-nowrap">
						{getMessage()}
					</div>
				</div>
				<div className="absolute top-[20%] left-[50%] transform -translate-x-1/2 rounded-md text-center text-sm z-30">
					<img src="/progress3.png" alt="프로그레스 바" />
				</div>
				<button
					type="button"
					style={{ transform: "scale(0.7)" }}
					onClick={() => setShowTutorial(true)}
				>
					<img src="/infoBtn.png" alt="인포메이션 버튼" />
				</button>
			</div>
			<button type="button" onClick={handleDoughcatClick}>
				<img
					style={{ scale: 1.2 }}
					src={getDoughcatImage()}
					alt="반죽"
					className="absolute top-[60%] left-[53%] transform -translate-x-1/2 -translate-y-1/2 w-1/3 md:w-1/4 z-0"
				/>
			</button>
			<button
				type="button"
				onClick={() => handleNextClick()}
				className="absolute bottom-8 right-8 w-[200px] h-[60px] bg-[url('/nextbtn.png')] bg-contain bg-no-repeat bg-center bg-transparent p-0 border-none z-20"
			/>
		</div>
	);
}

export default Shaping;
