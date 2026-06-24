import { create } from "zustand";
import { persist } from "zustand/middleware";

import { createWebPersistStorage } from "@/lib/web-storage";

type PendingInviteStore = {
  token: string | null;
  setToken: (token: string) => void;
  clearToken: () => void;
};

export const usePendingInviteStore = create<PendingInviteStore>()(
  persist(
    (set) => ({
      token: null,
      setToken: (token) => set({ token }),
      clearToken: () => set({ token: null }),
    }),
    {
      name: "thalia-pending-invite",
      storage: createWebPersistStorage(),
    },
  ),
);
