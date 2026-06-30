import { create } from "zustand";
import { persist } from "zustand/middleware";

import { createWebPersistStorage } from "@/lib/web-storage";

type OnboardingStore = {
  completed: boolean;
  introSeen: boolean;
  hydrated: boolean;
  complete: () => void;
  markIntroSeen: () => void;
  reset: () => void;
};

export const useOnboardingStore = create<OnboardingStore>()(
  persist(
    (set) => ({
      completed: false,
      introSeen: false,
      hydrated: false,
      complete: () => set({ completed: true, introSeen: true }),
      markIntroSeen: () => set({ introSeen: true }),
      reset: () => set({ completed: false, introSeen: false }),
    }),
    {
      name: "thalia-onboarding",
      storage: createWebPersistStorage(),
      version: 1,
      partialize: (state) => ({
        completed: state.completed,
        introSeen: state.introSeen,
      }),
      migrate: (persistedState) => {
        const state = persistedState as Partial<OnboardingStore>;

        if (state.completed) {
          return { ...state, introSeen: true };
        }

        return state as OnboardingStore;
      },
      onRehydrateStorage: () => () => {
        useOnboardingStore.setState({ hydrated: true });
      },
    },
  ),
);

useOnboardingStore.persist.onFinishHydration(() => {
  useOnboardingStore.setState({ hydrated: true });
});

if (useOnboardingStore.persist.hasHydrated()) {
  useOnboardingStore.setState({ hydrated: true });
}

export function useOnboardingHydrated() {
  return useOnboardingStore((state) => state.hydrated);
}
