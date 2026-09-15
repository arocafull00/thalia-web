"use client";

import { CreditCard, LogOut } from "lucide-react";

import SubscriptionPlanSummary from "@/components/billing/subscription/components/subscription-plan-summary";
import { useSubscriptionPage } from "@/components/billing/subscription/hooks/use-subscription-page";
import { Button } from "@/components/ui/button";
import TopbarClinicSelector from "@/components/ui/topbar-clinic-selector";
import { BILLING_COPY, BILLING_STATUS_LABELS } from "@/copy/billing-copy";
import type {
  ClinicBillingSummary,
  ClinicMembershipRole,
} from "@/types/database.types";

type SubscriptionPageClientProps = {
  billing: ClinicBillingSummary;
  checkoutResult: string | null;
  clinicName: string;
  membershipCount: number;
  role: ClinicMembershipRole;
};

export default function SubscriptionPageClient({
  billing,
  checkoutResult,
  clinicName,
  membershipCount,
  role,
}: SubscriptionPageClientProps) {
  const page = useSubscriptionPage({
    clinicId: billing.clinic_id,
    status: billing.subscription_status,
    checkoutResult,
  });
  const isOwner = role === "owner";
  const canStartCheckout = [
    "not_started",
    "canceled",
    "incomplete_expired",
  ].includes(billing.subscription_status);
  const title = isOwner
    ? BILLING_COPY.ownerBlockedTitle
    : BILLING_COPY.memberBlockedTitle;
  const description = isOwner
    ? BILLING_COPY.ownerBlockedDescription
    : BILLING_COPY.memberBlockedDescription;

  return (
    <main className="flex min-h-screen w-full items-center justify-center bg-canvas p-6">
      <div className="grid w-full max-w-4xl gap-8 lg:grid-cols-[1fr_360px]">
        <section className="flex flex-col justify-center">
          <p className="text-sm font-medium text-primary">{clinicName}</p>
          <h1 className="mt-3 max-w-xl text-4xl font-semibold tracking-tight text-ink text-wrap-balance">
            {page.waitingForWebhook ? BILLING_COPY.waitingTitle : title}
          </h1>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-ink-secondary">
            {page.waitingForWebhook
              ? BILLING_COPY.waitingDescription
              : description}
          </p>
          <p className="mt-5 text-sm text-ink-muted">
            {BILLING_COPY.status}:{" "}
            {BILLING_STATUS_LABELS[billing.subscription_status]}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            {isOwner ? (
              <Button
                type="button"
                disabled={page.isPending || page.waitingForWebhook}
                onClick={canStartCheckout ? page.openCheckout : page.openPortal}
              >
                <CreditCard aria-hidden="true" />
                {canStartCheckout
                  ? BILLING_COPY.checkoutAction
                  : BILLING_COPY.portalAction}
              </Button>
            ) : null}
            <Button
              type="button"
              variant="ghost"
              disabled={page.isPending}
              onClick={() => void page.signOut()}
            >
              <LogOut aria-hidden="true" />
              {BILLING_COPY.signOut}
            </Button>
            {membershipCount > 1 ? <TopbarClinicSelector /> : null}
          </div>
        </section>
        <SubscriptionPlanSummary />
      </div>
    </main>
  );
}
