"use client";

import { CreditCard, LogOut } from "lucide-react";

import SubscriptionPaywallHero from "@/components/billing/subscription/components/subscription-paywall-hero";
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
    <main className="flex min-h-screen bg-surface">
      <section className="flex min-h-screen flex-1 flex-col bg-surface">
        <div className="flex flex-1 items-center justify-center px-6 py-10 lg:px-8">
          <div className="w-full max-w-[520px]">
            <p className="text-sm font-medium text-primary">{clinicName}</p>
            <h1 className="mt-3 text-3xl font-semibold tracking-[-0.03em] text-ink text-wrap-balance sm:text-4xl sm:leading-[1.1]">
              {page.waitingForWebhook ? BILLING_COPY.waitingTitle : title}
            </h1>
            <p className="mt-4 max-w-lg text-sm leading-relaxed text-ink-secondary sm:text-base">
              {page.waitingForWebhook
                ? BILLING_COPY.waitingDescription
                : description}
            </p>

            <div
              aria-live="polite"
              className="mt-6 inline-flex items-center gap-2 rounded-badge border border-border-strong bg-surface px-3 py-1.5 text-sm text-ink-secondary shadow-float"
            >
              <span
                aria-hidden="true"
                className={`size-1.5 rounded-full bg-primary ${page.waitingForWebhook ? "animate-pulse motion-reduce:animate-none" : ""}`}
              />
              <span>
                {BILLING_COPY.status} —{" "}
                {BILLING_STATUS_LABELS[billing.subscription_status]}
              </span>
            </div>

            <div className="mt-8">
              <SubscriptionPlanSummary />
            </div>

            <div className="mt-8 flex flex-col items-start gap-3 sm:flex-row sm:flex-wrap sm:items-center">
              {isOwner ? (
                <Button
                  type="button"
                  size="lg"
                  disabled={page.isPending || page.waitingForWebhook}
                  onClick={
                    canStartCheckout ? page.openCheckout : page.openPortal
                  }
                  className="rounded-full px-6"
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
                className="rounded-full"
              >
                <LogOut aria-hidden="true" />
                {BILLING_COPY.signOut}
              </Button>
              {membershipCount > 1 ? <TopbarClinicSelector /> : null}
            </div>
          </div>
        </div>
      </section>
      <SubscriptionPaywallHero />
    </main>
  );
}
