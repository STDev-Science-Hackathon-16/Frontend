import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTokenStore } from "@/stores/useTokenStore";
import toast from 'react-hot-toast';

const loginSchema = z.object({
	phone: z
		.string()
		.regex(/^010\d{8}$/, "전화번호는 010으로 시작하는 11자리 숫자여야 합니다."),
	password: z.string().regex(/^\d{8}$/, "비밀번호는 숫자 8자리여야 합니다."),
});

type LoginForm = z.infer<typeof loginSchema>;

function Home() {
	const { token, setToken } = useTokenStore();

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
						icon: '🎉',
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

	return (
		// biome-ignore lint/a11y/useKeyWithClickEvents: <explanation>
		<div
			onClick={handleScreenClick}
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
				<div style={{ backgroundColor: '#e9d7c8', padding: '12px', borderRadius: '8px' }}>
					<div className="blinking-text">
					게임을 시작하시려면 아무곳이나 클릭해보세요
					</div>
				</div>
				)}
		</div>
	);
}

export default Home;
