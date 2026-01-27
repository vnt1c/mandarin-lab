import { create } from "zustand";

type UIState = {
  authOpen: boolean;
  openAuth: () => void;
  closeAuth: () => void;
  setAuthOpen: (open: boolean) => void;
};

export const useUIStore = create<UIState>((set) => ({
  authOpen: false,
  openAuth: () => set({ authOpen: true }),
  closeAuth: () => set({ authOpen: false }),
  setAuthOpen: (open) => set({ authOpen: open }),
}));
