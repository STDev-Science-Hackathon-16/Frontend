import { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import TimerCircle from "@/components/TimerCircle"; // Assuming path is correct
import GetRandomArray, {
	type GetRandomArrayHandle,
} from "@/components/getRandomArray"; // Assuming path is correct
import { useGameIdStore } from "@/stores/useGameIdStore";
import { useTokenStore } from "@/stores/useTokenStore";
import { useBreadStore } from "@/stores/useBreadStore";

function Baking() {
	const navigate = useNavigate();

	const token = useTokenStore((state) => state.token);
	const gameId = useGameIdStore((state) => state.gameId);
	const [showTutorial, setShowTutorial] = useState(true);
	const [lifes, setLifes] = useState(3);
	const [downTem, setDownTem] = useState(0);
	const [topTem, setTopTem] = useState(0);
	const [downHum, setDownHum] = useState(0);
	const [topHum, setTopHum] = useState(0);
	const [temDieFlag, setTemDieFlag] = useState(false); // Corrected typo
	const [humDieFlag, setHumDieFlag] = useState(false); // Corrected typo
	const [timeFlag, setTimeFlag] = useState(false); // Corrected typo
	const [gameOver, setGameOver] = useState(false); // Game over state
	const [gameWon, setGameWon] = useState(false); // Game won state

	const randomRef = useRef<GetRandomArrayHandle | null>(null);

	useEffect(() => {
		if (lifes <= 0 && !gameOver && !gameWon) {
			setGameOver(true);

			console.log(
				`Stats: downTem=${downTem}, topTem=${topTem}, downHum=${downHum}, topHum=${topHum}`,
			);

			const postGameData = async () => {
				const payload = {
					gameId: gameId,
					downTem: downTem,
					topTem: topTem,
					downHum: downHum,
					topHum: topHum,
					temDieFlag: temDieFlag,
					humDieFlag: humDieFlag,
					timeFlag: timeFlag,
				};
				console.log("Payload:", payload);
				try {
					const response = await fetch(
						"http://54.180.191.123:8080/api/game/step5",
						{
							method: "POST",
							headers: {
								"Content-Type": "application/json",
								"X-USER-ID": token?.toString() || "",
							},
							body: JSON.stringify(payload),
						},
					);
					if (!response.ok) throw new Error("Failed to post game data");
					const result = await response.json();
					if (result.status === "success" && result.data?.bread !== null) {
						useBreadStore.getState().setBreadState(result.data);
						navigate("/ending");
					}
				} catch (error) {
					console.error("Error posting game data:", error);
				}
			};
			postGameData();
		}
	}, [
		lifes,
		gameOver,
		gameWon,
		temDieFlag,
		humDieFlag,
		timeFlag,
		downTem,
		topTem,
		downHum,
		topHum,
		navigate,
		gameId,
		token,
	]);

	useEffect(() => {
		const checkWinInterval = setInterval(() => {
			if (randomRef.current?.isComplete() && !gameOver && !gameWon) {
				setGameWon(true);
				clearInterval(checkWinInterval);
			}
		}, 500);
		return () => clearInterval(checkWinInterval);
	}, [gameOver, gameWon]);

	const handleTimeout = () => {
		if (!gameOver && !gameWon) {
			console.log("Timer Expired!");
			setTimeFlag(true);
			setLifes(0);
		}
	};

	const handleClick = (clickedValue: number) => {
		if (showTutorial || gameOver || gameWon || !randomRef.current) return;

		const expectedValue = randomRef.current.getCurrentValue();

		if (expectedValue === null) {
			console.log("No expected value, perhaps the queue is empty?");
			return;
		}

		const matched = randomRef.current.removeIfMatch(clickedValue);

		if (!matched) {
			console.log(
				`Mismatch! Expected: ${expectedValue}, Clicked: ${clickedValue}`,
			);
			let die = false;
			let lifeLost = true;

			switch (expectedValue) {
				case 0:
					if (clickedValue === 1) {
						setHumDieFlag(true);
						die = true;
					} else if (clickedValue === 2 || clickedValue === 3) {
						setDownHum((prev) => prev + 1);
					} else lifeLost = false;
					break;
				case 1: // Expected: Up Hum
					if (clickedValue === 0) {
						setHumDieFlag(true);
						die = true;
					} else if (clickedValue === 2 || clickedValue === 3) {
						setTopHum((prev) => prev + 1);
					} else lifeLost = false;
					break;
				case 2: // Expected: Down Temp
					if (clickedValue === 3) {
						setTemDieFlag(true);
						die = true;
					} else if (clickedValue === 0 || clickedValue === 1) {
						setDownTem((prev) => prev + 1);
					} else lifeLost = false;
					break;
				case 3: // Expected: Up Temp
					if (clickedValue === 2) {
						setTemDieFlag(true);
						die = true;
					} else if (clickedValue === 0 || clickedValue === 1) {
						setTopTem((prev) => prev + 1);
					} else lifeLost = false;
					break;
				default:
					lifeLost = false; // Should not happen
					break;
			}

			if (die) {
				setLifes(0); // Instantly end the game
			} else if (lifeLost) {
				setLifes((prev) => Math.max(0, prev - 1)); // Decrement life, minimum 0
			}
		} else {
			console.log("Correct!");
			// Optional: Add feedback for correct click
		}
	};

	const handleStartGame = () => {
		setShowTutorial(false);
		// Reset game state if restarting (optional, depends on flow)
		// setLifes(3);
		// setGameOver(false);
		// setGameWon(false);
		// ... reset other states ...
	};

	return (
		<div
			className="flex items-center justify-center min-h-screen w-full bg-cover bg-top fixed top-0 left-0 right-0 bottom-0 overflow-hidden"
			style={{ backgroundImage: `url('/bg2.png')` }}
		>
			{showTutorial && (
				<div className="fixed inset-0 bg-black bg-opacity-80 z-50 flex flex-col items-center justify-center text-white px-6">
					<div className="mx-auto p-4 text-xl leading-relaxed">
						고온의 오븐에 들어가면 반죽 속 전분은 젤라틴화, 단백질은 굳게 되어
						빵의 조직이 고정돼요.
						<br /> <br /> 동시에 겉면은 마이야르 반응을 통해 갈색 껍질을 만들죠.
						<br /> <br /> 하지만 너무 빨리 열을 가하거나 수분이 부족하면 껍질이
						먼저 마르고, 내부는 덜 익을 수 있어요.
						<br /> <br /> 그래서 온도와 습도 조절이 아주 중요해요!
						<br /> <br /> 오븐은 까칠하거든요!
						<br /> <br /> 온도, 습도, 시간까지 다 챙겨야 해요!
						<br /> <br /> 틀리면 하트가 사라지고, 온·습도를 반대로 누르면....
						처음부터 다시!
					</div>

					<button
						type="button"
						onClick={handleStartGame} // Use dedicated handler
						className="absolute bottom-8 right-8 w-[200px] h-[60px] bg-[url('/nextbtn.png')] bg-contain bg-no-repeat bg-center bg-transparent p-0 border-none z-20 cursor-pointer" // Added cursor
					/>
				</div>
			)}
			{/* --- Game UI --- */}
			{!showTutorial && ( // Render game UI only when tutorial is hidden
				<>
					{/* Top Bar */}
					<div className="absolute top-8 left-8 right-8 flex justify-between items-start z-20">
						{/* Character & Speech */}
						<div className="flex items-center gap-2">
							{/* ... character image ... */}
							<img
								src="/normalyeast.png"
								alt="character"
								className="w-16 h-12 z-10"
							/>
							<div className="bg-amber-500 px-4 py-2 rounded-2xl font-bold text-white text-lg whitespace-nowrap">
								{/* Dynamic speech based on state? */}
								{gameOver
									? "이런! 실패했어..."
									: gameWon
										? "완벽해!"
										: "잘 보고 눌러!"}
							</div>
						</div>
						{/* Progress Bar */}
						<div className="absolute top-0 left-1/2 transform -translate-x-1/2 px-4 py-2 rounded-md text-center text-sm z-30">
							<img src="/progress5.png" alt="프로그레스 바" />{" "}
							{/* Update progress dynamically? */}
						</div>
						{/* Info Button */}
						<button
							type="button"
							style={{ transform: "scale(0.7)" }}
							onClick={() => setShowTutorial(true)} // Re-show tutorial
							disabled={gameOver || gameWon} // Disable when game ended
						>
							<img src="/infoBtn.png" alt="인포메이션 버튼" />
						</button>
					</div>

					{/* Lifes */}
					<div className="absolute top-[15%] left-[4.5%] transform -translate-y-1/2 z-10 flex gap-2 scale-90">
						{" "}
						{/* Adjusted position & scale */}
						{Array.from({ length: 3 }, (_, i) => (
							<img
								// biome-ignore lint/suspicious/noArrayIndexKey: Simple static array
								key={i}
								src={i < lifes ? "/lifes.png" : "/deadlifes.png"}
								alt={i < lifes ? `하트${i + 1}` : `죽은하트${i + 1}`}
								className="w-10 h-10 transition-opacity duration-300" // Smaller, added transition
							/>
						))}
					</div>

					{/* Queue Display */}
					<div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-30">
						<GetRandomArray ref={randomRef} />
					</div>

					{/* Action Buttons */}
					<div className="absolute bottom-[5%] right-[9%]">
						<button
							type="button"
							onClick={() => handleClick(0)}
							disabled={gameOver || gameWon}
						>
							<img
								src="/downhumbtn.png"
								alt="습도 down 버튼"
								className={gameOver || gameWon ? "opacity-50" : ""}
							/>
						</button>
					</div>
					<div className="absolute bottom-[5%] right-[1%]">
						<button
							type="button"
							onClick={() => handleClick(1)}
							disabled={gameOver || gameWon}
						>
							<img
								src="/uphumbtn.png"
								alt="습도 up 버튼"
								className={gameOver || gameWon ? "opacity-50" : ""}
							/>
						</button>
					</div>
					<div className="absolute bottom-[26%] right-[5%]">
						<button
							type="button"
							onClick={() => handleClick(2)}
							disabled={gameOver || gameWon}
						>
							<img
								src="/downtempbtn.png"
								alt="온도 down 버튼"
								className={gameOver || gameWon ? "opacity-50" : ""}
							/>
						</button>
					</div>
					<div className="absolute bottom-[45%] right-[5%]">
						<button
							type="button"
							onClick={() => handleClick(3)}
							disabled={gameOver || gameWon}
						>
							<img
								src="/uptempbtn.png"
								alt="온도 up 버튼"
								className={gameOver || gameWon ? "opacity-50" : ""}
							/>
						</button>
					</div>

					{/* Timer */}
					<div className="absolute top-[70%] left-[10.8%] transform -translate-x-1/2 -translate-y-1/2 z-30 w-32 h-32">
						{/* Optional: Static decorative element if needed */}
						{/* <img style={{ scale: 0.7 }} src="eclip.png" alt="eclipse" /> */}
					</div>
					<div className="absolute top-[70%] left-[10.8%] transform -translate-x-1/2 -translate-y-1/2 z-0 w-32 h-32">
						<img
							src="/timer0.png"
							alt="타이머 배경"
							className="w-full h-full"
						/>
						<TimerCircle
							duration={21} // Adjust duration as needed
							isPaused={showTutorial || gameOver || gameWon} // Pause if tutorial shown or game ended
							onTimeout={handleTimeout}
						/>
					</div>

					{/* Baking Image */}
					<img
						style={{ scale: 0.8 }}
						src="/normalbaking.png" // Change image based on state? e.g., burnt on game over
						alt="반죽"
						className="absolute top-[60%] left-[48%] transform -translate-x-1/2 -translate-y-1/2 w-1/3 md:w-1/4 z-0"
					/>
				</>
			)}{" "}
			{/* End conditional rendering of game UI */}
		</div>
	);
}

export default Baking;
