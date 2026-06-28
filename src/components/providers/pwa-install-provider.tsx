"use client";

import { useEffect } from "react";

import { isBeforeInstallPromptEvent } from "@/lib/pwa/before-install-prompt-event";
import { detectPwaEnvironment } from "@/lib/pwa/detect-pwa-environment";
import { usePwaInstallStore } from "@/stores/pwa-install-store";

type PwaInstallProviderProps = {
  children: React.ReactNode;
};

export default function PwaInstallProvider({ children }: PwaInstallProviderProps) {
  useEffect(() => {
    usePwaInstallStore.getState().setEnvironment(detectPwaEnvironment());

    const handleBeforeInstallPrompt = (event: Event) => {
      if (!isBeforeInstallPromptEvent(event)) {
        return;
      }

      event.preventDefault();
      usePwaInstallStore.getState().setDeferredPrompt(event);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, []);

  return children;
}
