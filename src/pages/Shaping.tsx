import { useTokenStore } from "@/stores/useTokenStore";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Shaping() {
	const token = useTokenStore((state) => state.token);
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
			const response = await fetch("http://54.79.169.133:8080/api/game/step3", {
				method: "POST",
				credentials: "include",
				headers: {
					"Content-Type": "application/json",
					"X-USER-ID": token?.toString() || "",
				},
				body: JSON.stringify({
					gameId: 1,
					tap: doughcatClickCount,
				}),
			});

			const result = await response.json();

			if (result.status === "success" && result.data.pass === true) {
				navigate("/ending");
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
