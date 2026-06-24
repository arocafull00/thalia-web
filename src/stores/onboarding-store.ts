import { useEffect, useState } from "react";
import { create } from "zustand";
import { persist } from "zustand/middleware";

import { createWebPersistStorage } from "@/lib/web-storage";

type OnboardingStore = {
  completed: boolean;
  introSeen: boolean;
  complete: () => void;
  markIntroSeen: () => void;
  reset: () => void;
};

export const useOnboardingStore = create<OnboardingStore>()(
  persist(
    (set) => ({
      completed: false,
      introSeen: false,
      complete: () => set({ completed: true, introSeen: true }),
      markIntroSeen: () => set({ introSeen: true }),
      reset: () => set({ completed: false, introSeen: false }),
    }),
    {
      name: "thalia-onboarding",
      storage: createWebPersistStorage(),
      version: 1,
      migrate: (persistedState) => {
        const state = persistedState as Partial<OnboardingStore>;

        if (state.completed) {
          return { ...state, introSeen: true };
        }

        return state as OnboardingStore;
      },
    },
  ),
);

export function useOnboardingHydrated() {
  const [hydrated, setHydrated] = useState(useOnboardingStore.persist.hasHydrated());

  useEffect(() => {
    const unsubscribe = useOnboardingStore.persist.onFinishHydration(() => {
      setHydrated(true);
    });

    if (useOnboardingStore.persist.hasHydrated()) {
      setHydrated(true);
    }

    return unsubscribe;
  }, []);

  return hydrated;
}
