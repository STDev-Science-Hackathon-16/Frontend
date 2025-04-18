import { create } from "zustand";

interface TokenState {
	token: number | null;
	setToken: (token: number) => void;
	clearToken: () => void;
}

export const useTokenStore = create<TokenState>((set) => ({
	token: null,
	setToken: (token) => set({ token }),
	clearToken: () => set({ token: null }),
}));
