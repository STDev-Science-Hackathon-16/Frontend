import { useGameIdStore } from "@/stores/useGameIdStore";
import { useTokenStore } from "@/stores/useTokenStore";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from 'react-hot-toast';

function SecondaryFermentation() {
	const [showTutorial, setShowTutorial] = useState(true);
	const [clickcount, setClickcount] = useState(0);
	const token = useTokenStore((state) => state.token);
	const gameId = useGameIdStore((state) => state.gameId);

	const questions = [
		{
			question: "문제1. 발효가 잘 된 반죽의 특징으로 올바른 것은?",
			answers: [
				"A. 표면이 거칠고 딱딱하다",
				"B. 손으로 눌렀을 때 부드럽고 천천히 되돌아온다",
				"C. 물처럼 흐른다",
				"D. 냄새가 거의 없다",
			],
			correctIndex: 1,
		},
		{
			question: "문제2. 이스트가 발효를 통해 생성하는 주요 기체는 무엇인가요?",
			answers: ["A. 수소", "B. 이산화탄소", "C. 산소", "D. 질소"],
			correctIndex: 1,
		},
		{
			question: "문제3. 효모는 발효 과정에서 당분을 분해해 무엇을 만들까요?",
			answers: [
				"A. 이산화탄소와 알코올",
				"B. 물과 산소",
				"C. 비타민C",
				"D. 젖산",
			],
			correctIndex: 0,
		},
	];

	const navigate = useNavigate();
	const [currentIndex, setCurrentIndex] = useState(0);
	const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
	const [isTransitioning, setIsTransitioning] = useState(false); // To track transition state
	const [correctCount, setCorrectCount] = useState(0); // State to track correct answers

	useEffect(() => {
		let timer: NodeJS.Timeout;
		if (isTransitioning) {
			timer = setTimeout(() => {
				setIsTransitioning(false); // End transition state
				setSelectedIndex(null); // Reset selected visual

				// Move to next question or finish quiz
				if (currentIndex < questions.length - 1) {
					setCurrentIndex((prev) => prev + 1);
				}
			}, 500); // 0.5 second delay
		}

		return () => clearTimeout(timer);
	}, [isTransitioning, currentIndex]);

	const currentQuestion = questions[currentIndex];
	const boldQuestion = currentQuestion.question.replace(
		/^문제\d+/,
		(match) => `<b>${match}</b>`,
	);

	const handleAnswerClick = (index: number) => {
		if (isTransitioning) return;
		setSelectedIndex(index);
		setIsTransitioning(true);
		setClickcount((prev) => prev + 1);

		if (index === currentQuestion.correctIndex) {
			setCorrectCount((prev) => prev + 1);
		}
	};

	const handleNextClick = async () => {
		try {
			const response = await fetch(
				"http://54.180.191.123:8080/api/game/step4",
				{
					method: "POST",
					credentials: "include",
					headers: {
						"Content-Type": "application/json",
						"X-USER-ID": token?.toString() || "",
					},
					body: JSON.stringify({
						gameId: gameId,
						quiz: correctCount,
					}),
				},
			);

			const result = await response.json();

			if (result.data?.reward?.trim()) {
				toast(result.data.reward.trim(), {
					icon: '🎉',
				});
			}

			if (result.status === "success" && result.data.pass === true) {
				navigate("/baking");
			} else if (result.status === "success" && result.data.pass === false) {
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
						성형이 끝났다고 발효가 끝난 건 아니에요!
						<br />
						<br /> 이제 반죽은 2차 발효라는 마지막 성장의 시간을 가질 거예요.
						<br />
						<br /> 그 전에, 그동안 배운 내용과 빵에 대한 과학을 바탕으로 빵 속
						과학을 한 번 복습해볼까요?
						<br />
						<br /> "이제 진짜로 반죽을 재우기 전에… 도우냥이 몇 가지 퀴즈를
						내볼게요!
						<br />
						<br /> 그리 어렵진 않을거에요!
						<br />
						<br /> 틀리면... 듣고 있던 반죽이 슬퍼할지도 몰라요!
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
				<div className="absolute top-8 left-1/2 transform -translate-x-1/2 px-4 py-2 rounded-md text-center text-sm z-30">
					<img src="/progress4.png" alt="프로그레스 바" />
				</div>
				<button
					type="button"
					style={{ transform: "scale(0.7)" }}
					onClick={() => setShowTutorial(true)}
				>
					<img src="/infoBtn.png" alt="인포메이션 버튼" />
				</button>
			</div>

			<img
				style={{ scale: 1.2 }}
				src="/doughcat3.png"
				alt="반죽"
				className="absolute top-[60%] left-[35%] transform -translate-x-1/2 -translate-y-1/2 w-1/3 md:w-1/4 z-0"
			/>

			<div className="absolute top-[35%] right-[13%] w-[600px] h-[auto] transform -translate-y-1/2">
				<div className="relative w-full h-full">
					<img
						src="/question.png"
						alt="문제 배경"
						className="w-full h-auto object-contain" // Use h-auto for dynamic height based on content
					/>
					<div
						className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-black text-xl text-center px-10 w-full" // Added px-10 and w-full for padding
						// biome-ignore lint/security/noDangerouslySetInnerHtml: <explanation>
						dangerouslySetInnerHTML={{ __html: boldQuestion }}
					/>
				</div>
			</div>

			<div className="absolute top-[65%] right-[13%] w-[600px] transform -translate-y-1/2 flex flex-col items-center">
				{currentQuestion.answers.map((answer, index) => (
					<button
						key={`${currentQuestion.question}-${answer}`}
						type="button"
						onClick={() => handleAnswerClick(index)}
						disabled={isTransitioning}
						className="relative w-[90%] h-[60px]"
						style={{ cursor: isTransitioning ? "default" : "pointer" }}
					>
						<img
							src={selectedIndex === index ? "/ans.png" : "/answer.png"}
							alt={`답변 ${index + 1} 배경`}
							className="w-full h-full object-contain"
						/>
						<div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-black text-lg px-4 text-center w-full truncate">
							{answer}
						</div>
					</button>
				))}
			</div>
			{currentIndex === questions.length - 1 && clickcount >= 3 && (
				<button
					type="button"
					onClick={handleNextClick}
					className="absolute bottom-8 right-8 w-[200px] h-[60px] bg-[url('/nextbtn.png')] bg-contain bg-no-repeat bg-center bg-transparent p-0 border-none z-20"
				/>
			)}
		</div>
	);
}

export default SecondaryFermentation;
