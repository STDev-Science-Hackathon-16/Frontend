export async function handleSubmitStep1(
	clickCounts: Record<string, number>,
	token: string | null,
) {
	const {
		waterClickCount,
		oliveoilClickCount,
		levainClickCount,
		weakflourClickCount,
		strongflourClickCount,
		yeastClickCount,
		saltClickCount,
		sugarClickCount,
		bakingpowderClickCount,
	} = clickCounts;

	const select: number[] = [];
	if (waterClickCount) select.push(...Array(waterClickCount).fill(1));
	if (oliveoilClickCount) select.push(...Array(oliveoilClickCount).fill(2));
	if (levainClickCount) select.push(3);
	if (weakflourClickCount) select.push(4);
	if (strongflourClickCount) select.push(5);
	if (yeastClickCount) select.push(6);
	if (saltClickCount) select.push(7);
	if (sugarClickCount) select.push(8);
	if (bakingpowderClickCount) select.push(9);

	try {
		const response = await fetch("http://54.180.191.123:8080/api/game/step1", {
			method: "POST",
			credentials: "include",
			headers: {
				"Content-Type": "application/json",
				"X-USER-ID": token ?? "",
			},
			body: JSON.stringify({ select }),
		});

		const result = await response.json();
		return result;
	} catch (error) {
		console.error("Error during step1 submit:", error);
		throw error;
	}
}
