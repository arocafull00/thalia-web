import { redirect } from "next/navigation";

import SubscriptionPageClient from "@/components/billing/subscription/page.client";
import StoreHydrator from "@/components/providers/store-hydrator";
import { hasPendingTeamInvites } from "@/lib/registration-metadata";
import { getAppBootstrap } from "@/lib/server/bootstrap";

export default async function SubscriptionPage({
  searchParams,
}: {
  searchParams: Promise<{ checkout?: string }>;
}) {
  const [{ user, profile, memberships, activeClinicId }, params] =
    await Promise.all([getAppBootstrap(), searchParams]);

  if (!user) {
    redirect("/login");
  }

  const membership =
    memberships.find((item) => item.clinicId === activeClinicId) ??
    memberships.find((item) => item.status === "active");

  if (!membership) {
    redirect("/no-membership");
  }

  if (profile?.account_type === "external") {
    redirect("/dashboard");
  }

  if (
    membership.billing.subscription_status === "trialing" ||
    membership.billing.subscription_status === "active"
  ) {
    redirect(hasPendingTeamInvites(user) ? "/invite-team" : "/dashboard");
  }

  return (
    <StoreHydrator
      user={user}
      profile={profile}
      memberships={memberships}
      activeClinicId={membership.clinicId}
    >
      <SubscriptionPageClient
        billing={membership.billing}
        checkoutResult={params.checkout ?? null}
        clinicName={membership.clinicName}
        membershipCount={memberships.length}
        role={membership.role}
      />
    </StoreHydrator>
  );
}
