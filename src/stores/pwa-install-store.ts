import { create } from "zustand";

import type { BeforeInstallPromptEvent } from "@/lib/pwa/before-install-prompt-event";
import type { PwaEnvironment } from "@/lib/pwa/detect-pwa-environment";

type PwaInstallStore = {
  deferredPrompt: BeforeInstallPromptEvent | null;
  environment: PwaEnvironment;
  setDeferredPrompt: (event: BeforeInstallPromptEvent | null) => void;
  setEnvironment: (environment: PwaEnvironment) => void;
};

export const usePwaInstallStore = create<PwaInstallStore>((set) => ({
  deferredPrompt: null,
  environment: { isStandalone: false, isIOS: false, isInAppBrowser: false },
  setDeferredPrompt: (deferredPrompt) => set({ deferredPrompt }),
  setEnvironment: (environment) => set({ environment }),
}));
