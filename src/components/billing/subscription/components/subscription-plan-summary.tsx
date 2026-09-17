import { BILLING_COPY } from "@/copy/billing-copy";

export default function SubscriptionPlanSummary() {
  return (
    <section
      aria-labelledby="subscription-plan-title"
      className="relative w-full max-w-md"
    >
      <div className="border-b border-border-strong pb-7">
        <p
          id="subscription-plan-title"
          className="text-sm font-medium text-primary"
        >
          {BILLING_COPY.planLabel} — {BILLING_COPY.planName}
        </p>
        <p className="mt-2 flex flex-wrap items-baseline gap-x-2 text-ink">
          <span className="num text-4xl font-semibold tracking-tight sm:text-5xl">
            {BILLING_COPY.priceAmount}
          </span>
          <span className="text-base font-medium text-ink-secondary sm:text-lg">
            {BILLING_COPY.priceCadence}
          </span>
        </p>
      </div>

      <dl className="space-y-4 py-7">
        <div className="grid grid-cols-[auto_1fr_auto] items-end gap-2">
          <dt className="text-xs text-ink-secondary sm:text-sm">
            {BILLING_COPY.trialDaysLabel}
          </dt>
          <div
            aria-hidden="true"
            className="mb-1 border-b border-dotted border-border-strong"
          />
          <dd className="num text-sm font-medium text-ink">
            {BILLING_COPY.trialDaysValue}
          </dd>
        </div>
        <div className="grid grid-cols-[auto_1fr_auto] items-end gap-2">
          <dt className="text-xs text-ink-secondary sm:text-sm">
            {BILLING_COPY.cardRequiredLabel}
          </dt>
          <div
            aria-hidden="true"
            className="mb-1 border-b border-dotted border-border-strong"
          />
          <dd className="text-sm font-medium text-ink">
            {BILLING_COPY.cardRequiredValue}
          </dd>
        </div>
        <div className="grid grid-cols-[auto_1fr_auto] items-end gap-2">
          <dt className="text-xs text-ink-secondary sm:text-sm">
            {BILLING_COPY.billingCycleLabel}
          </dt>
          <div
            aria-hidden="true"
            className="mb-1 border-b border-dotted border-border-strong"
          />
          <dd className="text-right text-xs font-medium text-ink sm:text-sm">
            {BILLING_COPY.billingCycleValue}
          </dd>
        </div>
      </dl>

      <div className="flex items-baseline justify-between gap-4 border-t border-border-strong pt-5">
        <span className="text-sm text-ink-secondary">
          {BILLING_COPY.trialTotalLabel}
        </span>
        <span className="num text-xl font-semibold text-primary">
          {BILLING_COPY.trialTotalValue}
        </span>
      </div>
    </section>
  );
}
