// src/components/Chatbot.tsx

import { useRef, useEffect, useState } from "react";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import { AiOutlineSend } from "react-icons/ai";
import { useFailStore } from "@/stores/useFailStore";
import { useNavigate } from "react-router-dom";
interface ChatMessage {
	role: "user" | "assistant" | "system";
	content: string;
}

const apiKey = import.meta.env.VITE_OPENAI_API_KEY;

const step = ["1단계", "2단계", "3단계", "4단계", "5단계"];

const context = `당신은 숙련된 베이킹 전문가입니다. 사용자가 치아바타, 포카치아, 사워도우 중 하나를 완성할 수 있도록 5단계에 걸쳐 안내해야 합니다.

1. 각 단계에서 사용자의 입력에 맞춰 반응하며, 적절한 질문, 간단한 설명, 피드백을 제공합니다.
2. 반드시 베이킹 전문가 역할을 유지하며, 사용자의 응답 외의 내용은 만들어내지 않습니다.
3. 모든 응답은 한국어로 50자 이내로 작성합니다.
4. 문제가 발생하면 system 메시지로 알려줍니다.

[단계별 지식]

■ 1단계: 반죽 선택  
- 치아바타: 물, 올리브, 강력분, 이스트, 소금  
- 포카치아: 물, 올리브, 올리브, 강력분, 이스트, 소금  
- 사워도우: 물, 발효종, 강력분, 소금

■ 2단계: 1차 발효  
- 공식: 온도 = (발효정도 ÷ 시간) + 25  
- 실패 조건:  
  - 온도 > 40도 → 이스트 사망  
  - 온도 < 10도 → 이스트 사망  
  - 시간 > 21초 → 발효 실패  
  - 성공 기준 : 온도가 11도 ~ 39도까지, 시간은 19도 ~ 21도까지야!

■ 3단계: 성형  
- 10회 이하 → 성형 부족  
- 50회 이상 → 성형 과도
- 11회 ~ 50회까지가 성공!

■ 4단계: 2차 발효  
- 퀴즈 형식: 사용자가 질문하면 간단한 베이킹 지식을 알려줍니다.  
- 주제 예시: 글루텐, 기공, 성형법, 수화율 등

■ 5단계: 굽기  
- 성공 조건:  
  - 온도: 220~230도  
  - 습도: 80~90%  
- 실패 조건:  
  - 온도가 범위를 벗어나거나  
  - 습도가 부족하거나 과할 경우

[응답 형식]

각 응답에는 다음 3가지를 포함해야 합니다:

1. **과학적 설명**: 지금 단계에서 일어나는 과정을 간단히 설명합니다.  
   예: 2차 발효는 내부 기공을 만드는 과정이에요.

2. **공손한 질문**: 사용자의 다음 행동을 유도합니다.  
   예: 다음으로 성형 횟수를 알려주시겠어요?

3. **분석된 피드백**: 잘못된 입력에 대해 원인을 짧게 설명합니다.   근데 정답은 알려주지마!
   예: 시간이 23초라 발효가 지나쳤어요.

캐릭터를 유지하며, 질문 + 설명 + 피드백을 균형 있게 담아주세요.`;

const Chatbot = () => {
	const fail = useFailStore();
	const navigate = useNavigate();
	const getFailImage = () => {
		if (typeof fail === "number" && fail === 1) {
			return "/fermdie.png";
		}
		if (typeof fail === "number" && fail === 2) {
			return "/shapingdie.png";
		}
		if (typeof fail === "number" && fail === 3) {
			return "/bakingdie.png";
		}
		return "/doughdie.png";
	};

	const [userInput, setUserInput] = useState<string>(""); // 사용자 입력 상태 관리
	const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]); // 채팅 히스토리 관리
	const [isHide, setIsHide] = useState<boolean>(false);
	const chatBoxRef = useRef<HTMLDivElement>(null);

	const chatRef = useRef<HTMLDivElement>(null);

	const getPromptEngineering = () => {
		return [{ role: "system", content: context }, ...chatHistory];
	};

	const handleQuickReply = (reply: string) => {
		setIsHide(true);
		fetchBotReply(reply);
	};

	const fetchBotReply = async (input: string) => {
		if (!input.trim()) return;

		// 사용자 메시지 채팅 히스토리에 추가
		setChatHistory((prev) => [...prev, { role: "user", content: input }]);
		try {
			const response = await axios.post(
				"https://api.openai.com/v1/chat/completions",
				{
					// model: 'gpt-3.5-turbo',
					model: "gpt-4o",
					messages: [
						...getPromptEngineering(),
						{ role: "user", content: input },
					],
					temperature: 0.8, // 답변의 창의성, 무작위성. 낮을수록 T
					max_tokens: 256, // 응답받을 메시지 최대 토큰(단어) 수 설정
					top_p: 1, // 토큰 샘플링 확률을 설정, 높을수록 다양한 출력을 유도
					frequency_penalty: 0.5, // 일반적으로 나오지 않는 단어를 억제하는 정도
					presence_penalty: 0.5, // 동일한 단어나 구문이 반복되는 것을 억제하는 정도
				},
				{
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${apiKey}`,
					},
				},
			);
			console.log("api 호출", response);
			if (
				// biome-ignore lint/complexity/useOptionalChain: <explanation>
				response.data &&
				response.data.choices &&
				response.data.choices.length > 0
			) {
				const reply = response.data.choices[0]?.message.content.trim(); // optional chaining 사용
				if (reply) {
					setChatHistory((prev) => [
						...prev,
						{ role: "assistant", content: reply },
					]);
				} else {
					setChatHistory((prev) => [
						...prev,
						{
							role: "system",
							content: "에러가 발생했으니 잠시만 기다려주세요.",
						},
					]);
					throw new Error("API 응답에서 텍스트가 유효하지 않습니다.");
				}
			} else {
				setChatHistory((prev) => [
					...prev,
					{ role: "system", content: "에러가 발생했으니 잠시만 기다려주세요." },
				]);
				throw new Error("API 응답이 예상대로 구조화되지 않았습니다.");
			}
		} catch (error: unknown) {
			setChatHistory((prev) => [
				...prev,
				{ role: "system", content: "에러가 발생했으니 잠시만 기다려주세요." },
			]);
			if (axios.isAxiosError(error)) {
				alert(`오류가 발생했습니다. ${error}`);
			}
		}
	};

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setUserInput(e.target.value);
	};

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (userInput.trim()) {
			fetchBotReply(userInput);
			setUserInput("");
		}
	};
	function handleScrollToBottom(parent: HTMLDivElement, child: HTMLDivElement) {
		const parentHeight = parent.clientHeight;
		const childHeight = child.clientHeight;

		// 자식 요소의 높이가 부모 요소의 높이에 닿았을 때
		if (childHeight >= parentHeight) {
			parent.scrollTop = parent.scrollHeight; // 부모 요소를 가장 아래로 스크롤
		}
	}
	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		if (chatBoxRef.current && chatRef.current) {
			handleScrollToBottom(chatBoxRef.current, chatRef.current);
		}
	}, [chatHistory]);

	const handleHomeClick = () => {
		navigate("/");
	};

	return (
		<div
			className="flex items-center justify-center min-h-screen w-full bg-cover bg-top fixed top-0 left-0 right-0 bottom-0 overflow-hidden"
			style={{ backgroundImage: `url('/bg1.png')` }}
		>
			<div className="absolute inset-0 bg-black opacity-80" />

			<div className="flex justify-end items-center w-full h-screen pr-4 z-10">
				<img
					src={getFailImage()}
					alt="실패 반죽"
					className="absolute top-[30%] left-[15%] w-[18%] m-4"
				/>
				<section
					id="chat-scroll-allowed"
					className="card w-1/2 bg-white h-[90vh] shadow-lg rounded-xl"
				>
					{/* 채팅 메시지를 표시하는 영역 */}
					<div
						ref={chatBoxRef}
						className="card-body flex-grow overflow-y-scroll "
					>
						<div
							ref={chatRef}
							className="flex-grow flex flex-col align-bottom justify-end gap-1 snap-y snap-mandatory "
						>
							{chatHistory.map((message, index) => (
								<div
									// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
									key={index}
									className={`flex items-center snap-center ${message.role === "user" ? "justify-end" : "justify-start"}`}
								>
									{message.role === "user" && (
										<div className="flex items-end max-w-[70%] my-1">
											<div className="bg-orange-200 rounded-lg py-2 px-3 mr-2">
												<p className="text-sm">{message.content}</p>
											</div>
											<div className="flex-shrink-0 w-10 h-10">
												{/* <img src={chatFox} alt="당신" className="w-full h-full rounded-full" /> */}
											</div>
										</div>
									)}
									{message.role === "assistant" && (
										<div className="flex items-end max-w-[70%] my-1">
											<div className="flex-shrink-0 w-10 h-10 mr-2">
												{/* <img src={chatPrince} alt="도우미" className="w-full h-full rounded-full" /> */}
											</div>
											<div className="bg-blue-200 rounded-lg py-2 px-3">
												<ReactMarkdown>{message.content}</ReactMarkdown>
											</div>
										</div>
									)}
									{message.role === "system" && (
										<div className="bg-red-100 text-red-700 px-4 py-2 mx-auto rounded-lg max-w-[80%]">
											<p className="text-sm">{message.content}</p>
										</div>
									)}
								</div>
							))}
						</div>
					</div>

					{/* 입력창을 항상 화면 하단에 고정 */}
					<div className="card-actions bottom-0 bg-white py-2">
						<div className="flex flex-wrap gap-2 justify-center">
							{step.map((reply) => (
								<button
									type="button"
									key={reply}
									onClick={() => handleQuickReply(reply)}
									className={` bg-gray-200 rounded-full h-9 w-20 font-bold text-gray-600 hover:bg-blue-200 text-sm ${isHide ? "hidden" : "block"}`}
								>
									{reply}
								</button>
							))}
						</div>
						<form onSubmit={handleSubmit} className="w-full p-7 pt-2">
							<div className="flex px-5 py-3 border-2 border-gray-400 rounded-full justify-between">
								<input
									type="text"
									value={userInput}
									onChange={handleInputChange}
									placeholder="궁금한 과학 원리를 물어봐!"
									className="w-full outline-none"
								/>
								<button type="submit" className="ml-2">
									<AiOutlineSend />
								</button>
							</div>
						</form>
					</div>
				</section>
				<button
					type="button"
					onClick={handleHomeClick}
					className="absolute bottom-[5%] left-[15%] w-[20%] h-[12%] bg-[url('/homebtn.png')] bg-contain bg-no-repeat bg-center bg-transparent p-0 border-none z-20"
				/>
			</div>
		</div>
	);
};

export default Chatbot;
