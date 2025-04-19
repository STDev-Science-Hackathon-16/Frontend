import { useNavigate } from "react-router-dom";
import { useEffect, useState, useCallback, useRef } from "react";
import { useTokenStore } from "@/stores/useTokenStore";

function PrimaryFermentation() {
	const navigate = useNavigate();
	const token = useTokenStore((state) => state.token);

	const [showTutorial, setShowTutorial] = useState(true);
	const [temperature, setTemperature] = useState(25);
	const [progress, setProgress] = useState(0);
	const startTimeRef = useRef(Date.now());
	const isGameOver = useRef(false); // 중복 요청 방지

	const getDoughLeft = () => {
		const start = 15.5;
		const end = 63;
		const ratio = doughProgress / 100;
		return start + (end - start) * ratio;
	};

	const [doughProgress, setDoughProgress] = useState(0);

	useEffect(() => {
		if (showTutorial) return;

		const interval = setInterval(() => {
			setDoughProgress((prev) => {
				if (prev >= 100) return 100;

				let speed = 1;
				if (temperature > 10 && temperature <= 18) speed = 0.5;
				else if (temperature > 18 && temperature <= 27) speed = 0.7;
				else if (temperature > 27 && temperature <= 35) speed = 1.2;
				else if (temperature > 35 && temperature <= 40) speed = 2.0;

				return Math.min(prev + speed, 100);
			});
		}, 250);

		return () => clearInterval(interval);
	}, [temperature, showTutorial]);

	useEffect(() => {
		if (showTutorial) return;

		const interval = setInterval(() => {
			setTemperature((prev) => prev - 0.5);
		}, 300);

		return () => clearInterval(interval);
	}, [showTutorial]);

	const handleKeyPress = useCallback((e: KeyboardEvent) => {
		if (e.code === "Space") {
			setTemperature((prev) => prev + 3);
		}
	}, []);

	const getDoughImage = () => {
		if (doughProgress >= 50) return "/dough2.png";
		if (doughProgress >= 20) return "/dough1.png";
		return "/dough0.png";
	};

	useEffect(() => {
		window.addEventListener("keydown", handleKeyPress);
		return () => window.removeEventListener("keydown", handleKeyPress);
	}, [handleKeyPress]);

	const getThermometerHeight = () => {
		const minTemperature = 10;
		const maxTemperature = 40;
		const percent =
			((temperature - minTemperature) / (maxTemperature - minTemperature)) *
			100;
		const minHeight = 27;
		return `${Math.min(100, Math.max(minHeight, percent))}%`;
	};

	useEffect(() => {
		if (showTutorial) return;

		const interval = setInterval(() => {
			setProgress((prev) => {
				if (prev >= 71.5) {
					clearInterval(interval);
					return 71.5;
				}
				return prev + 0.715;
			});
		}, 250);

		return () => clearInterval(interval);
	}, [showTutorial]);

	const sendGameResult = useCallback(async () => {
		if (isGameOver.current) return;
		isGameOver.current = true;

		const elapsedSeconds = Math.floor(
			(Date.now() - startTimeRef.current) / 1000,
		);

		let flag = 0;
		if (temperature <= 10) flag = 1;
		else if (temperature >= 40) flag = 2;

		try {
			const response = await fetch("http://54.79.169.133:8080/api/game/step2", {
				method: "POST",
				credentials: "include",
				headers: {
					"Content-Type": "application/json",
					"X-USER-ID": token?.toString() || "",
				},
				body: JSON.stringify({
					gameId: 26,
					time: elapsedSeconds,
					temperature: doughProgress,
					flag: flag,
				}),
			});
			console.log(elapsedSeconds, doughProgress, "flag:", flag);

			const result = await response.json();
			if (result.status === "success" && result.data.pass === true) {
				navigate("/shaping");
			} else if (result.status === "success" && result.data.pass === false) {
				navigate("/fail");
				console.log(result);
			}
		} catch (error) {
			console.error("결과 전송 실패:", error);
		}
	}, [navigate, doughProgress, temperature, token]);

	useEffect(() => {
		const elapsedSeconds = Math.floor(
			(Date.now() - startTimeRef.current) / 1000,
		);
		if (temperature > 40 || temperature < 10 || elapsedSeconds > 25) {
			sendGameResult();
		}
	}, [temperature, sendGameResult]);

	// 버튼 클릭 시 POST 요청
	const handleNext = () => {
		sendGameResult();
	};

	return (
		<div
			className="flex items-center justify-center min-h-screen w-full bg-cover bg-center fixed top-0 left-0 right-0 bottom-0 overflow-hidden"
			style={{ backgroundImage: `url('/bg1.png')` }}
		>
			{showTutorial && (
				<div className="fixed inset-0 bg-black bg-opacity-80 z-50 flex flex-col items-center justify-center text-white px-6">
					<div className="mx-auto p-4 text-xl leading-relaxed">
						반죽을 덮고 쉬게 하면, 이스트가 활동을 시작해요.
						<br />
						<br /> 이스트는 반죽 속 당분을 분해하면서 이산화탄소와 소량의
						알코올을 만들어내요.
						<br />
						<br /> 그 기체들이 글루텐 구조 안에 갇혀서 반죽이 부풀어 오르게
						되죠.
						<br />
						<br /> 하지만 온도나 시간이 너무 높거나 낮으면 이스트가 지치거나
						얼어버릴 수도 있어요!
						<br />
						<br /> 이스트 친구들을 재워줄 시간이에요~
						<br />
						<br /> 너무 덥게 하면 익어버리고, 너무 춥게 하면 잠들어버린답니다!
						<br />
						<br /> 왼쪽 아래 버튼으로 추워지지도, 뜨거워지지도 않게 잘
						발효시켜봐요.
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
					<div className="relative w-20 h-20 flex-shrink-0">
						<img
							src="/Rectangle1527.png"
							alt="frame"
							className="absolute top-0 left-0 w-full h-full"
						/>
						<img
							src="/normalyeast.png"
							alt="character"
							className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-12 z-10"
						/>
					</div>
					<div className="bg-amber-500 px-4 py-2 rounded-2xl font-bold text-white text-lg whitespace-nowrap">
						할 말이 들어갑니다(Pretendard)
					</div>
				</div>
				<div className="absolute top-8 left-1/2 transform -translate-x-1/2 bg-gray-200 px-4 py-2 rounded-md text-center text-sm z-30">
					프로세스와 예행(15일 중)
				</div>
				<button
					type="button"
					style={{ transform: "scale(0.7)" }}
					onClick={() => setShowTutorial(true)}
				>
					<img src="/infoBtn.png" alt="인포메이션 버튼" />
				</button>
			</div>

			<div className="absolute inset-0 flex items-center justify-center z-10">
				<img
					style={{ scale: 2.0 }}
					src="/timeRect.png"
					alt="타임"
					className="absolute top-[25%] left-[63%] transform -translate-x-1/2 -translate-y-1/2 w-1/3 md:w-1/4 z-0"
				/>
				<div
					style={{
						scale: 0.7,
						width: "7%",
					}}
					className="absolute top-[22.3%] left-[63%] transform -translate-y-1/2 h-[8%] bg-green-400 rounded-full z-0"
				/>
				<div
					style={{
						scale: 0.7,
						width: `${Math.min(progress, 100)}%`,
						transition: "width 0.25s linear",
					}}
					className="absolute top-[22.3%] left-[25.5%] transform -translate-y-1/2 rounded-full z-10 bg-[#FF7B29] bg-opacity-70 h-[8%] origin-left"
				/>
				<img
					src="/ferm1.png"
					alt="발효정도"
					style={{
						scale: 0.1,
						left: `${getDoughLeft()}%`,
						transition: "left 0.2s linear",
					}}
					className="absolute top-[-1.2%] transform -translate-x-1/2 -translate-y-1/2 w-1/3 md:w-1/4 z-30"
				/>

				<img
					style={{ scale: 1.2 }}
					src={getDoughImage()}
					alt="반죽"
					className="absolute top-[60%] left-[53%] transform -translate-x-1/2 -translate-y-1/2 w-1/3 md:w-1/4 z-0"
				/>
				<img
					style={{ scale: 0.7 }}
					src="/temp1.png"
					alt="온도계"
					className="absolute top-[18%] left-[20%] w-[12%] md:w-[6%]"
				/>
				<div
					style={{
						scale: 0.39,
						height: getThermometerHeight(),
					}}
					className="absolute bottom-[25%] left-[21.5%] w-[3%] bg-[#CE0303] rounded-sm z-20 transition-all duration-200 origin-bottom"
				/>
			</div>
			<button
				type="button"
				onClick={() => handleNext()}
				className="absolute bottom-8 right-8 w-[200px] h-[60px] bg-[url('/nextbtn.png')] bg-contain bg-no-repeat bg-center bg-transparent p-0 border-none z-20"
			/>
		</div>
	);
}

export default PrimaryFermentation;
