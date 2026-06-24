import { create } from "zustand";
import { persist } from "zustand/middleware";

import { createWebPersistStorage } from "@/lib/web-storage";

export type OnboardingIntent = "owner" | "employee";

type OnboardingIntentStore = {
  intent: OnboardingIntent | null;
  setIntent: (intent: OnboardingIntent) => void;
  clearIntent: () => void;
};

export const useOnboardingIntentStore = create<OnboardingIntentStore>()(
  persist(
    (set) => ({
      intent: null,
      setIntent: (intent) => set({ intent }),
      clearIntent: () => set({ intent: null }),
    }),
    {
      name: "thalia-onboarding-intent",
      storage: createWebPersistStorage(),
    },
  ),
);
