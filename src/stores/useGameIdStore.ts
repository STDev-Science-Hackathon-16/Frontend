import { create } from "zustand";
import { persist } from "zustand/middleware";

interface GameIdState {
	gameId: number | null;
	setGameId: (gameId: number) => void;
	clearGameId: () => void;
}

export const useGameIdStore = create<GameIdState>()(
	persist(
		(set) => ({
			gameId: null,
			setGameId: (gameId) => set({ gameId }),
			clearGameId: () => set({ gameId: null }),
		}),
		{
			name: "game-id-storage", // localStorage의 key 이름
		},
	),
);
