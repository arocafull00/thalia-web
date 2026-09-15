"use client";

import { useBillingPortal } from "@/components/billing/hooks/use-billing-portal";
import SettingsSubscriptionPanel from "@/components/settings/components/settings-subscription-panel";
import { useActiveClinic } from "@/lib/hooks/use-active-clinic";

export default function SettingsSubscriptionPanelContainer() {
  const { accountType, billing, clinicId, platformRole } = useActiveClinic();
  const portal = useBillingPortal(clinicId);

  if (accountType === "external" || !billing) {
    return null;
  }

  return (
    <SettingsSubscriptionPanel
      billing={billing}
      canManage={platformRole === "owner"}
      isPending={portal.isPending}
      onManage={portal.openPortal}
    />
  );
}
