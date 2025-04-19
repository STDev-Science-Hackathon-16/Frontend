import { create } from "zustand";

interface FailState {
	fail: number;
	setFail: (fail: number) => void;
	clearFail: () => void;
}

export const useFailStore = create<FailState>((set) => ({
	fail: 0,
	setFail: (fail) => set({ fail }),
	clearFail: () => set({ fail: 0 }),
}));
