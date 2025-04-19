import { useGameIdStore } from "@/stores/useGameIdStore";
import { useTokenStore } from "@/stores/useTokenStore";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useFailStore } from "@/stores/useFailStore";

function Dough() {
	const navigate = useNavigate();
	const [showTutorial, setShowTutorial] = useState(true);
	const { setGameId } = useGameIdStore();
	const { setFail } = useFailStore();

	const token = useTokenStore((state) => state.token);

	const [waterClickCount, setWaterClickCount] = useState(0);
	const [oliveoilClickCount, setOliveoilClickCount] = useState(0);
	const [yeastClickCount, setYeastClickCount] = useState(0);
	const [bakingpowderClickCount, setBakingpowderClickCount] = useState(0);
	const [levainClickCount, setLevainClickCount] = useState(0);
	const [weakflourClickCount, setWeakflourClickCount] = useState(0);
	const [strongflourClickCount, setStrongflourClickCount] = useState(0);
	const [saltClickCount, setSaltClickCount] = useState(0);
	const [sugarClickCount, setSugarClickCount] = useState(0);

	const handleWaterClick = () => {
		setWaterClickCount((prev) => Math.min(prev + 1, 2));
	};

	const handleOliveoilClick = () => {
		setOliveoilClickCount((prev) => Math.min(prev + 1, 2));
	};

	const handleYeastClick = () => {
		setYeastClickCount((prev) => Math.min(prev + 1, 1));
	};

	const handleBakingpowderClick = () => {
		setBakingpowderClickCount((prev) => Math.min(prev + 1, 1));
	};

	const handleWeakflourClick = () => {
		setWeakflourClickCount((prev) => Math.min(prev + 1, 1));
	};

	const handleStrongflourClick = () => {
		setStrongflourClickCount((prev) => Math.min(prev + 1, 1));
	};

	const handleSaltClick = () => {
		setSaltClickCount((prev) => Math.min(prev + 1, 1));
	};

	const handleSugarClick = () => {
		setSugarClickCount((prev) => Math.min(prev + 1, 1));
	};

	const handleLevainClick = () => {
		setLevainClickCount((prev) => Math.min(prev + 1, 1));
	};

	const getBowlImage = () => {
		const totalClicks =
			waterClickCount +
			oliveoilClickCount +
			yeastClickCount +
			bakingpowderClickCount +
			levainClickCount +
			weakflourClickCount +
			strongflourClickCount +
			saltClickCount +
			sugarClickCount;

		if (totalClicks >= 3) return "/bowl1.png";
		if (totalClicks >= 1) return "/bowl2.png";
		return "/bowl.png";
	};

	const getWaterImage = () => {
		if (waterClickCount === 1) return "/water1.png";
		if (waterClickCount === 2) return "/water2.png";
		return "/water.png";
	};

	const getOliveoilImage = () => {
		if (oliveoilClickCount === 1) return "/oliveoil1.png";
		if (oliveoilClickCount === 2) return "/oliveoil2.png";
		return "/oliveoil.png";
	};

	const getYeastImage = () => {
		return yeastClickCount === 1 ? "/yeast1.png" : "/yeast.png";
	};

	const getBakingpowderImage = () => {
		return bakingpowderClickCount === 1
			? "/bakingpowder1.png"
			: "/bakingpowder.png";
	};

	const handleNextClick = async () => {
		const select: number[] = [];
		if (waterClickCount >= 1) {
			for (let i = 0; i < waterClickCount; i++) {
				select.push(1);
			}
		}
		if (oliveoilClickCount >= 1) {
			for (let i = 0; i < oliveoilClickCount; i++) {
				select.push(2);
			}
		}
		if (levainClickCount === 1) {
			select.push(3);
		}
		if (weakflourClickCount === 1) {
			select.push(4);
		}
		if (strongflourClickCount === 1) {
			select.push(5);
		}
		if (yeastClickCount === 1) {
			select.push(6);
		}
		if (saltClickCount === 1) {
			select.push(7);
		}
		if (sugarClickCount === 1) {
			select.push(8);
		}
		if (bakingpowderClickCount === 1) {
			select.push(9);
		}

		try {
			const response = await fetch(
				"http://54.180.191.123:8080/api/game/step1",
				{
					method: "POST",
					credentials: "include",
					headers: {
						"Content-Type": "application/json",
						"X-USER-ID": token?.toString() || "",
					},
					body: JSON.stringify({ select }),
				},
			);

			const result = await response.json();

			if (result.data?.reward?.trim()) {
				toast(result.data.reward.trim(), {
					icon: "🎉",
				});
			}

			if (result.status === "success" && result.data.pass === true) {
				setGameId(result.data.gameId);
				navigate("/primary");
			} else if (result.status === "success" && result.data.pass === false) {
				setFail(0);
				navigate("/fail");
			}
		} catch (error) {
			console.error("Error during validation:", error);
		}
	};

	return (
		<div
			className="flex items-center justify-center min-h-screen w-full bg-cover bg-top fixed top-0 left-0 right-0 bottom-0 overflow-hidden"
			style={{ backgroundImage: `url('/bg1.png')` }}
		>
			{showTutorial && (
				<div className="fixed inset-0 bg-black bg-opacity-80 z-50 flex flex-col items-center justify-center text-white px-6">
					<div className="mx-auto p-4 text-xl leading-relaxed">
						밀가루 속에는 글루테닌과 글리아딘이라는 단백질이 있어요.
						<br />
						<br />이 단백질들은 물을 만나면 끈적한 그물망인 글루텐을 만들죠.
						<br />
						<br />
						글루텐은 이스트가 만든 기체를 가둬주는 일종의 풍선껍질 역할을 해요.
						<br />
						<br />이 구조 덕분에 반죽은 부풀 수 있고, 빵은 가볍고 폭신한 질감을
						갖게 되는 거예요!
						<br />
						<br />
						이제 진짜 반죽을 해볼 시간이에요!
						<br />
						<br /> 물, 밀가루, 소금… 다 준비됐죠?
						<br />
						<br />
						근데 한번 넣으면… 다시 재료를 분리할 수 없으니 주의해요!
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
					<img src="/progress1.png" alt="프로그레스 바" />
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
					style={{ scale: 1.2 }}
					src={getBowlImage()}
					alt="믹싱볼"
					className="absolute top-[60%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-1/3 md:w-1/4 z-0"
				/>
				<button type="button" onClick={handleLevainClick}>
					<img
						src="/levain.png"
						alt="발효종"
						className="absolute top-[32%] left-[23%] w-1/4 md:w-[15%] transform -translate-x-1/2 -translate-y-1/2"
					/>
				</button>
				<button type="button" onClick={handleBakingpowderClick}>
					<img
						src={getBakingpowderImage()}
						alt="베이킹파우더"
						className="absolute top-[52%] left-[14%] w-[12%] md:w-[6%]"
					/>
				</button>
				<button type="button" onClick={handleYeastClick}>
					<img
						src={getYeastImage()}
						alt="이스트"
						className="absolute top-[52%] left-[24%] w-[12%] md:w-[6%]"
					/>
				</button>
				<button type="button" onClick={handleSugarClick}>
					<img
						src="/sugar.png"
						alt="설탕"
						className="absolute top-[70%] left-[14%] w-[8%] md:w-[4%]"
					/>
				</button>
				<button type="button" onClick={handleSaltClick}>
					<img
						src="/salt.png"
						alt="소금"
						className="absolute top-[70%] left-[25%] w-[8%] md:w-[4%]"
					/>
				</button>
				<button type="button" onClick={handleOliveoilClick}>
					<img
						src={getOliveoilImage()}
						alt="올리브오일"
						className="absolute top-[35%] right-[28%] w-[10%] md:w-[7%] transform -translate-y-1/2"
					/>
				</button>
				<button type="button" onClick={handleWaterClick}>
					<img
						src={getWaterImage()}
						alt="물"
						className="absolute top-[35%] right-[15%] w-[18%] md:w-[10%] transform -translate-y-1/2"
					/>
				</button>
				<button type="button" onClick={handleStrongflourClick}>
					<img
						src="/strongflour.png"
						alt="강력분"
						className="absolute top-[68%] right-[28%] w-[12%] md:w-[8%] transform -translate-y-1/2"
					/>
				</button>
				<button type="button" onClick={handleWeakflourClick}>
					<img
						src="/weakflour.png"
						alt="박력분"
						className="absolute top-[68%] right-[15%] w-[12%] md:w-[8%] transform -translate-y-1/2"
					/>
				</button>
			</div>
			<button
				type="button"
				onClick={handleNextClick}
				className="absolute bottom-8 right-8 w-[200px] h-[60px] bg-[url('/nextbtn.png')] bg-contain bg-no-repeat bg-center bg-transparent p-0 border-none z-20"
			/>
		</div>
	);
}

export default Dough;
