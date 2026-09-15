import { redirect } from "next/navigation";

import InviteTeamPageClient from "@/components/onboarding/invite-team-page-client";
import { hasClinicBillingAccess } from "@/lib/billing";
import { getAppBootstrap } from "@/lib/server/bootstrap";

export default async function InviteTeamPage() {
  const { profile, memberships, activeClinicId } = await getAppBootstrap();
  const membership = memberships.find(
    (item) => item.clinicId === activeClinicId,
  );

  if (
    membership &&
    !hasClinicBillingAccess(
      profile?.account_type ?? null,
      membership.billing.subscription_status,
    )
  ) {
    redirect("/subscription");
  }

  return <InviteTeamPageClient />;
}
