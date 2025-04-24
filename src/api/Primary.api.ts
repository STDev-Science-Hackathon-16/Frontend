export const handleSubmitStep2 = async ({
	token,
	gameId,
	elapsedSeconds,
	doughProgress,
	temperature,
}: {
	token: string;
	gameId: string;
	elapsedSeconds: number;
	doughProgress: number;
	temperature: number;
}) => {
	let flag = 0;
	if (temperature <= 10) flag = 1;
	else if (temperature >= 40) flag = 2;

	try {
		const response = await fetch("http://54.180.191.123:8080/api/game/step2", {
			method: "POST",
			credentials: "include",
			headers: {
				"Content-Type": "application/json",
				"X-USER-ID": token,
			},
			body: JSON.stringify({
				gameId: gameId,
				time: elapsedSeconds,
				temperature: doughProgress,
				flag: flag,
			}),
		});

		const result = await response.json();
		return { result, flag, elapsedSeconds, doughProgress };
	} catch (error) {
		console.error("결과 전송 실패:", error);
		throw error;
	}
};
