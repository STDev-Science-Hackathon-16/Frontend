import { create } from "zustand";
import { persist } from "zustand/middleware";

interface TokenState {
	token: number | null;
	setToken: (token: number) => void;
	clearToken: () => void;
}

export const useTokenStore = create<TokenState>()(
	persist(
		(set) => ({
			token: null,
			setToken: (token) => set({ token }),
			clearToken: () => set({ token: null }),
		}),
		{
			name: "token-storage", // localStorage key
		},
	),
);
