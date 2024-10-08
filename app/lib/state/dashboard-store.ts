import { create } from "zustand";

interface DashboardActions {
    setNavLinkIndex: (navLinkIndex: number) => void;
}

interface DashboardState {
    navLinkIndex: number;
}

export const useDashboardStore = create<DashboardState & DashboardActions>((set) => ({
    navLinkIndex: 0,
    setNavLinkIndex: (navLinkIndex) => set({ navLinkIndex }),
}));

export default useDashboardStore;