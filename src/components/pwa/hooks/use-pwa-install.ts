import { useCallback } from "react";

import { usePwaInstallStore } from "@/stores/pwa-install-store";

export function usePwaInstall() {
  const deferredPrompt = usePwaInstallStore((state) => state.deferredPrompt);
  const environment = usePwaInstallStore((state) => state.environment);
  const setDeferredPrompt = usePwaInstallStore((state) => state.setDeferredPrompt);

  const canPromptInstall = deferredPrompt !== null;
  const isInstalled = environment.isStandalone;

  const handleInstall = useCallback(async () => {
    if (!deferredPrompt) {
      return;
    }

    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === "accepted") {
      setDeferredPrompt(null);
    }
  }, [deferredPrompt, setDeferredPrompt]);

  return {
    canPromptInstall,
    environment,
    handleInstall,
    isInstalled,
  };
}
