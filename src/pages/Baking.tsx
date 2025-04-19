import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import TimerCircle from "@/components/TimerCircle";
import GetRandomArray from "@/components/getRandomArray";

function Baking() {
	const navigate = useNavigate();
	const [showTutorial, setShowTutorial] = useState(true);
	const [lifes, setLifes] = useState(3);
	const [downTem, setDownTem] = useState(0);
	const [topTem, setTopTem] = useState(0);
	const [downHum, setDownHum] = useState(0);
	const [topHum, setTopHum] = useState(0);
	const [temDieFlag, setTemDieFlage] = useState(false);
	const [humDieFlag, setHumDieFlag] = useState(false);
	const [timeFlag, setTimeFlage] = useState(false);

	const randomRef = useRef<{ removeIfMatch: (value: number) => void } | null>(
		null,
	);

	const handleClick = (value: number) => {
		randomRef.current?.removeIfMatch(value);
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
						<br />
						<br /> 동시에 겉면은 마이야르 반응을 통해 갈색 껍질을 만들죠.
						<br />
						<br /> 하지만 너무 빨리 열을 가하거나 수분이 부족하면 껍질이 먼저
						마르고, 내부는 덜 익을 수 있어요.
						<br />
						<br /> 그래서 온도와 습도 조절이 아주 중요해요!
						<br />
						<br /> 오븐은 까칠하거든요!
						<br />
						<br /> 온도, 습도, 시간까지 다 챙겨야 해요!
						<br />
						<br />
						틀리면 하트가 사라지고, 온·습도를 반대로 누르면.... 처음부터 다시!
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
					<img src="/progress5.png" alt="프로그레스 바" />
				</div>
				<button
					type="button"
					style={{ transform: "scale(0.7)" }}
					onClick={() => setShowTutorial(true)}
				>
					<img src="/infoBtn.png" alt="인포메이션 버튼" />
				</button>
			</div>
			<div className="absolute top-[55%] left-[4.5%] transform -translate-y-1/2 z-10 flex gap-6 scale-75">
				{Array.from({ length: 3 }, (_, i) => (
					<img
						// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
						key={i}
						src={i < lifes ? "/lifes.png" : "/deadlifes.png"}
						alt={i < lifes ? `하트${i + 1}` : `죽은하트${i + 1}`}
						className="w-12 h-12"
					/>
				))}
			</div>
			<div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-30">
				<GetRandomArray ref={randomRef} />
			</div>

			<div className="absolute bottom-[5%] right-[9%] ...">
				<button type="button" onClick={() => handleClick(0)}>
					<img src="/downhumbtn.png" alt="습도 down 버튼" />
				</button>
			</div>
			<div className="absolute bottom-[5%] right-[1%] ...">
				<button type="button" onClick={() => handleClick(1)}>
					<img src="/uphumbtn.png" alt="습도 up 버튼" />
				</button>
			</div>
			<div className="absolute bottom-[26%] right-[5%] ...">
				<button type="button" onClick={() => handleClick(2)}>
					<img src="/downtempbtn.png" alt="온도 down 버튼" />
				</button>
			</div>
			<div className="absolute bottom-[45%] right-[5%] ...">
				<button type="button" onClick={() => handleClick(3)}>
					<img src="/uptempbtn.png" alt="온도 up 버튼" />
				</button>
			</div>
			<div className="absolute top-[70%] left-[10.8%] transform -translate-x-1/2 -translate-y-1/2 z-30 w-32 h-32">
				<img style={{ scale: 0.7 }} src="eclip.png" alt="eclipse" />
			</div>
			<div className="absolute top-[70%] left-[10.8%] transform -translate-x-1/2 -translate-y-1/2 z-0 w-32 h-32">
				<img src="/timer0.png" alt="타이머" className="w-full h-full" />
				<TimerCircle duration={21} isPaused={showTutorial} />
			</div>
			<img
				style={{ scale: 0.8 }}
				src="/normalbaking.png"
				alt="반죽"
				className="absolute top-[60%] left-[48%] transform -translate-x-1/2 -translate-y-1/2 w-1/3 md:w-1/4 z-0"
			/>
		</div>
	);
}

export default Baking;
