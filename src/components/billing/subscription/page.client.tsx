"use client";

import { CreditCard } from "lucide-react";

import SubscriptionPaywallHero from "@/components/billing/subscription/components/subscription-paywall-hero";
import SubscriptionPlanSummary from "@/components/billing/subscription/components/subscription-plan-summary";
import { useSubscriptionPage } from "@/components/billing/subscription/hooks/use-subscription-page";
import { Button } from "@/components/ui/button";
import TopbarClinicSelector from "@/components/ui/topbar-clinic-selector";
import { BILLING_COPY } from "@/copy/billing-copy";
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
  const title = page.webhookTimedOut
    ? BILLING_COPY.waitingTimeoutTitle
    : page.waitingForWebhook
      ? BILLING_COPY.waitingTitle
      : isOwner
        ? BILLING_COPY.ownerBlockedTitle
        : BILLING_COPY.memberBlockedTitle;
  const description = page.webhookTimedOut
    ? BILLING_COPY.waitingTimeoutDescription
    : page.waitingForWebhook
      ? BILLING_COPY.waitingDescription
      : isOwner
        ? BILLING_COPY.ownerBlockedDescription
        : BILLING_COPY.memberBlockedDescription;

  return (
    <main className="flex min-h-screen bg-surface">
      <section className="flex min-h-screen flex-1 flex-col bg-surface">
        <div className="flex flex-1 items-center justify-center px-6 py-10 lg:px-8">
          <div className="w-full max-w-[520px]">
            <p className="text-sm font-medium text-primary">{clinicName}</p>
            <h1 className="mt-3 text-3xl font-semibold tracking-[-0.03em] text-ink text-wrap-balance sm:text-4xl sm:leading-[1.1]">
              {title}
            </h1>
            <p className="mt-4 max-w-lg text-sm leading-relaxed text-ink-secondary sm:text-base">
              {description}
            </p>

            <div className="mt-8">
              <SubscriptionPlanSummary />
            </div>

            <div className="mt-8 flex flex-col gap-3">
              {membershipCount > 1 ? <TopbarClinicSelector /> : null}
              {page.webhookTimedOut ? (
                <Button
                  type="button"
                  size="lg"
                  disabled={page.isPending}
                  onClick={page.retryWebhookPoll}
                  className="w-full rounded-full px-6"
                >
                  {BILLING_COPY.waitingRetryAction}
                </Button>
              ) : null}
              {isOwner ? (
                <Button
                  type="button"
                  size="lg"
                  disabled={page.isPending || page.waitingForWebhook}
                  onClick={
                    canStartCheckout ? page.openCheckout : page.openPortal
                  }
                  className="w-full rounded-full px-6"
                >
                  <CreditCard aria-hidden="true" />
                  {canStartCheckout
                    ? BILLING_COPY.checkoutAction
                    : BILLING_COPY.portalAction}
                </Button>
              ) : null}
              <Button
                type="button"
                variant="link"
                disabled={page.isPending}
                onClick={() => void page.signOut()}
                className="w-full justify-center text-ink-secondary"
              >
                {BILLING_COPY.signOut}
              </Button>
            </div>
          </div>
        </div>
      </section>
      <SubscriptionPaywallHero />
    </main>
  );
}
