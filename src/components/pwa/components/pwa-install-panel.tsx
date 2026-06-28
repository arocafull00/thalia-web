"use client";

import { ActionButton, Notice } from "@/components/ui/primitives";
import { usePwaInstall } from "@/components/pwa/hooks/use-pwa-install";
import { PWA_INSTALL_COPY } from "@/components/pwa/pwa-install-copy";

export default function PwaInstallPanel() {
  const { canPromptInstall, environment, handleInstall, isInstalled } = usePwaInstall();

  if (isInstalled) {
    return null;
  }

  return (
    <section className="space-y-4">
      <h2 className="text-lg font-medium">{PWA_INSTALL_COPY.sectionTitle}</h2>
      <div className="space-y-3 rounded-2xl border border-border p-4">
        <div>
          <p className="font-medium text-ink">{PWA_INSTALL_COPY.title}</p>
          <p className="mt-1 text-sm text-ink-secondary">{PWA_INSTALL_COPY.description}</p>
        </div>
        {environment.isInAppBrowser ? (
          <Notice tone="warning" message={PWA_INSTALL_COPY.inAppBrowser} />
        ) : null}
        {!environment.isInAppBrowser && canPromptInstall ? (
          <ActionButton title={PWA_INSTALL_COPY.installButton} onClick={() => void handleInstall()} />
        ) : null}
        {!environment.isInAppBrowser && environment.isIOS ? (
          <Notice message={PWA_INSTALL_COPY.iosInstructions} />
        ) : null}
        {!environment.isInAppBrowser && !environment.isIOS && !canPromptInstall ? (
          <Notice message={PWA_INSTALL_COPY.browserMenuInstructions} />
        ) : null}
      </div>
    </section>
  );
}
