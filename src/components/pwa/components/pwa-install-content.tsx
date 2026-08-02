"use client";

import { usePwaInstall } from "@/components/pwa/hooks/use-pwa-install";
import { ActionButton } from "@/components/ui/primitives/action-button";
import { Notice } from "@/components/ui/primitives/notice";
import { PWA_INSTALL_COPY } from "@/copy/pwa-install-copy";

type PwaInstallContentProps = {
  onInstallSuccess?: () => void;
};

export default function PwaInstallContent({
  onInstallSuccess,
}: PwaInstallContentProps) {
  const { canPromptInstall, environment, handleInstall } = usePwaInstall();

  const handleInstallClick = async () => {
    if (!canPromptInstall) {
      return;
    }

    await handleInstall();
    onInstallSuccess?.();
  };

  return (
    <div className="space-y-4">
      <div>
        <p className="font-medium text-ink">{PWA_INSTALL_COPY.title}</p>
        <p className="mt-1 text-sm text-ink-secondary">
          {PWA_INSTALL_COPY.description}
        </p>
      </div>
      {environment.isInAppBrowser ? (
        <Notice tone="warning" message={PWA_INSTALL_COPY.inAppBrowser} />
      ) : null}
      {!environment.isInAppBrowser && canPromptInstall ? (
        <ActionButton
          title={PWA_INSTALL_COPY.installButton}
          onClick={() => void handleInstallClick()}
        />
      ) : null}
      {!environment.isInAppBrowser && environment.isIOS ? (
        <Notice message={PWA_INSTALL_COPY.iosInstructions} />
      ) : null}
      {!environment.isInAppBrowser &&
      !environment.isIOS &&
      !canPromptInstall ? (
        <Notice message={PWA_INSTALL_COPY.browserMenuInstructions} />
      ) : null}
    </div>
  );
}
