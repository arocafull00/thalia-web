"use client";

import PwaInstallContent from "@/components/pwa/components/pwa-install-content";
import { usePwaInstall } from "@/components/pwa/hooks/use-pwa-install";
import { PWA_INSTALL_COPY } from "@/copy/pwa-install-copy";

export default function PwaInstallPanel() {
  const { isInstalled } = usePwaInstall();

  if (isInstalled) {
    return null;
  }

  return (
    <section aria-labelledby="settings-pwa-heading" className="space-y-4">
      <h2
        id="settings-pwa-heading"
        className="border-b border-border-subtle pb-4 text-lg font-medium text-ink text-wrap-balance"
      >
        {PWA_INSTALL_COPY.sectionTitle}
      </h2>
      <div className="pt-2">
        <PwaInstallContent />
      </div>
    </section>
  );
}
