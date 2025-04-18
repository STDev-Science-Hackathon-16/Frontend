import { useState } from "react";

function Dough() {
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
		return totalClicks >= 1 ? "/bowl1.png" : "/bowl.png";
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

	return (
		<div
			className="flex items-center justify-center min-h-screen w-full bg-cover bg-top fixed top-0 left-0 right-0 bottom-0 overflow-hidden"
			style={{ backgroundImage: `url('/bg1.png')` }}
		>
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
				<button type="button" style={{ transform: "scale(0.7)" }}>
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
		</div>
	);
}

export default Dough;
