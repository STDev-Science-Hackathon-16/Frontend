import { create } from "zustand";

interface FailState {
	fail: number;
	failMessage: string;
	setFail: (newState: {
		failMessage: string | undefined;
		fail: number;
	}) => void;
	clearFail: () => void;
}

export const useFailStore = create<FailState>((set) => ({
	fail: 0,
	failMessage: "",
	setFail: (newState) =>
		set((state) => ({
			...state,
			fail: newState.fail,
			failMessage: newState.failMessage,
		})),
	clearFail: () => set({ fail: 0 }),
}));
