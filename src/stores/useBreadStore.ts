import { create } from "zustand";

type BreadState = {
	bread: string;
	time: number;
	temperature: number;
	tap: number;
	quiz: number;
	bakeTem: number;
	bakeHum: number;
	dieFlag: boolean;
	step: number;
	score: number;
	setBreadState: (newState: Partial<BreadState>) => void;
};

export const useBreadStore = create<BreadState>((set) => ({
	bread: "",
	time: 0,
	temperature: 0,
	tap: 0,
	quiz: 0,
	bakeTem: 0,
	bakeHum: 0,
	dieFlag: false,
	step: 0,
	score: 0,
	setBreadState: (newState) => set((state) => ({ ...state, ...newState })),
}));
