import { create } from "zustand";
import { persist } from "zustand/middleware";

import { createWebPersistStorage } from "@/lib/web-storage";

type PendingInviteStore = {
  token: string | null;
  invitationEmail: string | null;
  setToken: (token: string, email?: string) => void;
  clearToken: () => void;
};

export const usePendingInviteStore = create<PendingInviteStore>()(
  persist(
    (set) => ({
      token: null,
      invitationEmail: null,
      setToken: (token, email) =>
        set({ token, invitationEmail: email ?? null }),
      clearToken: () => set({ token: null, invitationEmail: null }),
    }),
    {
      name: "thalia-pending-invite",
      storage: createWebPersistStorage(),
    },
  ),
);
