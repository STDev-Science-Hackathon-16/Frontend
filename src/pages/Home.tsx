import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTokenStore } from "@/stores/useTokenStore";
import toast from "react-hot-toast";

const loginSchema = z.object({
	phone: z
		.string()
		.regex(/^010\d{8}$/, "전화번호는 010으로 시작하는 11자리 숫자여야 합니다."),
	password: z.string().regex(/^\d{8}$/, "비밀번호는 숫자 8자리여야 합니다."),
});

type LoginForm = z.infer<typeof loginSchema>;

function Home() {
	const catMessages = [
		"반죽에 욕심이 너무 많아요… 도우냥은 욕심이 싫어요.", // 1: 욕심쟁이 도우냥
		"간소한 선택, 고요한 반죽. 도우냥은 미니멀리스트였어요. 하지만 물과 이스트 밀가루가 없다면 빵이 되지 않는답니다", // 2: 조심성 도우냥
		"시간과 온도의 완벽한 조화… 도우냥은 1차발효 마스터!", // 3: 1차 발효 마스터
		"여긴… 스파가 아니에요. 효모가 다 익어버렸어요!", // 4: 화끈한 이스트 지옥탕
		"너무 추워요… 효모가 얼어붙었어요…", // 5: 북극남극
		"손끝에서 예술이 피어났어요… 빵도 감탄했죠.", // 6: 성형천재 도우냥
		"그만 좀 만지라구요! 도우냥이 과로로 눌려 터졌어요.", // 7: 찧고 빚고 또 찧고
		"조금... 더 과학 공부를 해야겠죠?", // 8: 공부가 필요한 도우냥
		"아니… 그건 반대예요… 도우냥이 오븐에서 혼절했어요.", // 9: 직화구이 천재 도우냥
		"아니… 그건 반대예요… 도우냥은 찜질방이 싫어요", // 10: 한증막 프로 설치사 도우냥
		"간당간당했지만… 결국 부풀었당!", // 11: 긴급구조 도우냥
		"아무 생각 없이 눌렀다간… 빵이 아니게 된답니다", // 12: 무지성 버튼냥
		"도우냥은 이제 모든 빵의 전문가예요.", // 13: 빵박사 인증
		"망했어도… 계속 해보고 싶은 건 왜일까요…?", // 14: 못미다스의 도우냥손
		"시작이 반이에요! 이제 차근차근 빵을 만들어봐요!", // 0: 기본 도우냥
	];

	const [activeCat, setActiveCat] = useState<number | null>(null);
	const handleCat = (catId: number) => () => {
		setActiveCat(catId);
	};

	const closeCatModal = () => {
		setActiveCat(null);
	};

	const [isOpened, setIsOpened] = useState(false);
	const { token, setToken } = useTokenStore();
	const [rewardIds, setRewardIds] = useState<number[]>([
		1, 2, 3, 4, 5, 6, 7, 8, 10, 11, 12, 13, 14, 15,
	]);

	const navigate = useNavigate();

	const [showPW, setShowPW] = useState(false);
	const [isLoggedIn, setIsLoggedIn] = useState(false);

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<LoginForm>({
		resolver: zodResolver(loginSchema),
	});

	const getPWImage = () => (showPW ? "/inputpw1.png" : "/inputpw0.png");

	const onSubmit = async (data: LoginForm) => {
		try {
			const response = await fetch("http://54.180.191.123:8080/api/member", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(data),
			});

			const json = await response.json();

			if (json.status === "success") {
				setToken(json.data.token);
				setIsLoggedIn(true);

				if (json.data?.reward?.trim()) {
					toast(json.data.reward.trim(), {
						icon: "🎉",
					});
				}
			}
		} catch (err) {
			console.error("로그인 요청 실패", err);
			alert("네트워크 오류가 발생했습니다.");
		}
	};

	const handleScreenClick = () => {
		if (isLoggedIn) navigate("/dough");
	};

	useEffect(() => {
		if (token !== null) {
			setIsLoggedIn(true);
		}
	}, [token]);

	useEffect(() => {
		if (!isLoggedIn) return;

		const fetchRewards = async () => {
			try {
				const response = await fetch("http://54.180.191.123:8080/api/rewards");
				const result = await response.json();

				if (result.status === "success") {
					const ids = result.data.map(
						(reward: { rewardId: number }) => reward.rewardId,
					);
					setRewardIds(ids); // 여기!
					console.log("보유한 rewardId 배열:", ids);
				}
			} catch (error) {
				console.error("업적 조회 실패:", error);
			}
		};

		fetchRewards();
	}, [isLoggedIn]);

	return (
		// biome-ignore lint/a11y/useKeyWithClickEvents: <explanation>
		<div
			onClick={(e) => {
				if (isOpened) return;

				const clickX = e.clientX;
				const screenWidth = window.innerWidth;
				const clickRatio = (clickX / screenWidth) * 100;

				if (clickRatio >= 20 && clickRatio <= 80) {
					handleScreenClick();
				}
			}}
			className="flex items-center justify-center min-h-screen w-full bg-cover bg-top fixed top-0 left-0 right-0 bottom-0 overflow-hidden"
			style={{ backgroundImage: `url('/bg0.png')` }}
		>
			{!isLoggedIn && (
				<form onSubmit={handleSubmit(onSubmit)} className="w-full">
					<div className="absolute top-[50%] right-[30%] w-[600px] transform -translate-y-1/2">
						<div className="relative w-full h-[100px]">
							<img
								src="/inputid.png"
								alt="전화번호 배경"
								className="absolute top-0 left-0 w-full h-full object-contain pointer-events-none"
							/>
							<input
								type="tel"
								inputMode="numeric"
								maxLength={11}
								pattern="\d*"
								placeholder="- 없이 전화번호를 입력해주세요"
								className="absolute top-0 left-0 w-full h-full bg-transparent px-6 py-4 text-center text-black text-lg outline-none z-10"
								{...register("phone")}
								onInput={(e) => {
									e.currentTarget.value = e.currentTarget.value.replace(
										/\D/g,
										"",
									);
								}}
							/>
							{errors.phone && (
								<p className="absolute top-full mt-10 text-red-500 text-center w-full">
									{errors.phone.message}
								</p>
							)}
						</div>
					</div>

					<div className="absolute top-[60%] right-[30%] w-[600px] transform -translate-y-1/2">
						<div className="relative w-full h-[100px]">
							<img
								src={getPWImage()}
								alt="비밀번호 배경"
								className="absolute top-0 left-0 w-full h-full object-contain pointer-events-none"
							/>
							<input
								type={showPW ? "text" : "password"}
								placeholder="숫자 8자리를 입력해주세요"
								maxLength={8}
								className="absolute top-0 left-0 w-full h-full bg-transparent px-6 py-4 text-center text-black text-lg outline-none z-10"
								{...register("password")}
								onInput={(e) => {
									e.currentTarget.value = e.currentTarget.value.replace(
										/\D/g,
										"",
									);
								}}
							/>
							{/* biome-ignore lint/a11y/useKeyWithClickEvents: <explanation> */}
							<div
								onClick={() => setShowPW((prev) => !prev)}
								className="absolute top-0 right-0 h-full w-[15%] z-20 cursor-pointer"
							/>
							{errors.password && (
								<p className="absolute top-full text-red-500 text-center w-full">
									{errors.password.message}
								</p>
							)}
						</div>
					</div>

					<div className="absolute bottom-[10%] right-[43.5%] w-[200px] transform -translate-y-1/2">
						<button type="submit">
							<img src="/loginbtn.png" alt="로그인 버튼" />
						</button>
					</div>
				</form>
			)}
			{isLoggedIn && (
				<div className="absolute top-[50%] left-[40%] blinking-text">
					게임을 시작하시려면 아무곳이나 클릭해보세요
				</div>
			)}

			{/* 업적 버튼 (trophy or x) */}
			<button
				type="button"
				onClick={() => setIsOpened(!isOpened)}
				className="absolute top-[6%] right-[2%] w-[5%] z-50"
			>
				<img src={isOpened ? "/x.png" : "/trophy.png"} alt="업적 이미지" />
			</button>
			{/* 어두운 배경 */}
			{isOpened && (
				<div className="fixed inset-0 bg-black opacity-20 z-20 pointer-events-none" />
			)}
			{isLoggedIn && (
				<div>
					{rewardIds.includes(1) && (
						<button onClick={handleCat(1)} type="button">
							<img
								src="/cat1.png"
								alt="보상 이미지"
								className="absolute bottom-[0] left-[8%] w-[15%] transform -translate-y-1/2 z-30"
							/>
						</button>
					)}

					{rewardIds.includes(2) && (
						<button onClick={handleCat(2)} type="button">
							<img
								src="/cat2.png"
								alt="보상 이미지"
								className="absolute bottom-[0] right-[12%] w-[10%] transform -translate-y-1/2 z-30"
							/>
						</button>
					)}
					{rewardIds.includes(3) && (
						<button onClick={handleCat(3)} type="button">
							<img
								src="/cat3.png"
								alt="보상 이미지"
								className="absolute bottom-[0] right-[7%] w-[10%] transform -translate-y-1/2 z-30"
							/>
						</button>
					)}
					{rewardIds.includes(4) && (
						<button onClick={handleCat(4)} type="button">
							<img
								src="/cat4.png"
								alt="보상 이미지"
								className="absolute bottom-[2%] left-[0] w-[15%] transform -translate-y-1/2 z-30"
							/>
						</button>
					)}
					{rewardIds.includes(5) && (
						<button onClick={handleCat(5)} type="button">
							<img
								src="/cat5.png"
								alt="보상 이미지"
								className="absolute top-[20%] right-[10%] w-[10%] transform -translate-y-1/2 z-30"
							/>
						</button>
					)}
					{rewardIds.includes(6) && (
						<button onClick={handleCat(6)} type="button">
							<img
								src="/cat6.png"
								alt="보상 이미지"
								className="absolute bottom-[-5%] right-[3%] w-[10%] transform -translate-y-1/2 z-30"
							/>
						</button>
					)}
					{rewardIds.includes(7) && (
						<button onClick={handleCat(7)} type="button">
							<img
								src="/cat7.png"
								alt="보상 이미지"
								className="absolute bottom-[-5%] right-[46%] w-[10%] transform -translate-y-1/2 z-30"
							/>
						</button>
					)}
					{rewardIds.includes(8) && (
						<button onClick={handleCat(8)} type="button">
							<img
								src="/cat8.png"
								alt="보상 이미지"
								className="absolute bottom-[0%] right-[35%] w-[10%] transform -translate-y-1/2 z-30"
							/>
						</button>
					)}

					{rewardIds.includes(10) && (
						<button onClick={handleCat(10)} type="button">
							<img
								src="/cat10.png"
								alt="보상 이미지"
								className="absolute bottom-[8%] right-[28%] w-[10%] transform -translate-y-1/2 z-30"
							/>
						</button>
					)}
					{rewardIds.includes(11) && (
						<button onClick={handleCat(11)} type="button">
							<img
								src="/cat11.png"
								alt="보상 이미지"
								className="absolute top-[28%] right-[13%] w-[20%] transform -translate-y-1/2 z-30"
							/>
						</button>
					)}
					{rewardIds.includes(12) && (
						<button onClick={handleCat(12)} type="button">
							<img
								src="/cat12.png"
								alt="보상 이미지"
								className="absolute top-[16%] left-[2%] w-[15%] transform -translate-y-1/2 z-30"
							/>
						</button>
					)}
					{rewardIds.includes(13) && (
						<button onClick={handleCat(13)} type="button">
							<img
								src="/cat13.png"
								alt="보상 이미지"
								className="absolute bottom-[20%] left-[0] w-[10%] transform -translate-y-1/2 z-30"
							/>
						</button>
					)}
					{rewardIds.includes(14) && (
						<button onClick={handleCat(14)} type="button">
							<img
								src="/cat14.png"
								alt="보상 이미지"
								className="absolute top-[20%] left-[10%] w-[10%] transform -translate-y-1/2 z-30"
							/>
						</button>
					)}
					{rewardIds.includes(15) && (
						<button onClick={handleCat(15)} type="button">
							<img
								src="/cat15.png"
								alt="보상 이미지"
								className="absolute bottom-[-3%] left-[33%] w-[10%] transform -translate-y-1/2 z-30"
							/>
						</button>
					)}
					{activeCat && (
						<div className="fixed inset-0 z-40 flex items-center justify-center bg-black bg-opacity-50">
							<div className="relative">
								<img
									src="/rewardrect.png"
									alt="보상 배경"
									className="w-[400px] h-[400px]"
								/>
								<img
									src={`/cat${activeCat}.png`}
									alt={`cat${activeCat}`}
									className="absolute top-1/4 left-1/2 w-[200px] h-[200px] transform -translate-x-1/2 -translate-y-1/2"
								/>
								<p className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[300px] text-center text-black text-sm font-semibold">
									{catMessages[activeCat - 1]}
								</p>
								<button
									type="button"
									onClick={closeCatModal}
									className="absolute top-2 right-2 w-6 h-6"
								>
									<img src="/x.png" alt="닫기" />
								</button>
							</div>
						</div>
					)}
				</div>
			)}
		</div>
	);
}

export default Home;
