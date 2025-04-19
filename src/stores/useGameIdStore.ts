import { create } from "zustand";

interface GameIdState {
	gameId: number | null;
	setGameId: (gameId: number) => void;
	clearGameId: () => void;
}

export const useGameIdStore = create<GameIdState>((set) => ({
	gameId: null,
	setGameId: (gameId) => set({ gameId }),
	clearGameId: () => set({ gameId: null }),
}));
