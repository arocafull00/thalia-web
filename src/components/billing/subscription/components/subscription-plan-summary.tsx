import { CalendarDays, CreditCard, ReceiptText } from "lucide-react";

import { BILLING_COPY } from "@/copy/billing-copy";

export default function SubscriptionPlanSummary() {
  return (
    <section className="rounded-2xl border border-border bg-surface p-6">
      <p className="text-sm font-medium text-primary">
        {BILLING_COPY.planName}
      </p>
      <p className="mt-2 text-3xl font-semibold tracking-tight text-ink">
        {BILLING_COPY.price}
      </p>
      <div className="mt-6 divide-y divide-border-subtle">
        <div className="flex items-center gap-3 py-3 text-sm text-ink-secondary">
          <CalendarDays className="size-4 text-primary" aria-hidden="true" />
          {BILLING_COPY.trial}
        </div>
        <div className="flex items-center gap-3 py-3 text-sm text-ink-secondary">
          <CreditCard className="size-4 text-primary" aria-hidden="true" />
          {BILLING_COPY.noCard}
        </div>
        <div className="flex items-center gap-3 py-3 text-sm text-ink-secondary">
          <ReceiptText className="size-4 text-primary" aria-hidden="true" />
          {BILLING_COPY.clinicBilling}
        </div>
      </div>
    </section>
  );
}
