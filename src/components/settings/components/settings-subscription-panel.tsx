import { CalendarClock, CreditCard, ReceiptText } from "lucide-react";

import ClinicInfoRow from "@/components/settings/components/clinic-info-row";
import { Button } from "@/components/ui/button";
import { BILLING_COPY, BILLING_STATUS_LABELS } from "@/copy/billing-copy";
import type { ClinicBillingSummary } from "@/types/database.types";

type SettingsSubscriptionPanelProps = {
  billing: ClinicBillingSummary;
  canManage: boolean;
  isPending: boolean;
  onManage: () => void;
};

function formatDate(value: string | null): string | null {
  if (!value) {
    return null;
  }

  return new Intl.DateTimeFormat("es-ES", { dateStyle: "long" }).format(
    new Date(value),
  );
}

export default function SettingsSubscriptionPanel({
  billing,
  canManage,
  isPending,
  onManage,
}: SettingsSubscriptionPanelProps) {
  return (
    <section aria-labelledby="settings-subscription-heading">
      <div className="flex items-center justify-between gap-4 border-b border-border-subtle pb-4">
        <h2
          id="settings-subscription-heading"
          className="text-lg font-medium text-ink"
        >
          {BILLING_COPY.settingsTitle}
        </h2>
        {canManage ? (
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={isPending}
            onClick={onManage}
          >
            <CreditCard aria-hidden="true" />
            {BILLING_COPY.portalAction}
          </Button>
        ) : null}
      </div>
      <div className="divide-y divide-border-subtle">
        <ClinicInfoRow
          icon={ReceiptText}
          label={BILLING_COPY.status}
          value={BILLING_STATUS_LABELS[billing.subscription_status]}
        />
        <ClinicInfoRow
          icon={CalendarClock}
          label={
            billing.subscription_status === "trialing"
              ? BILLING_COPY.trialEnds
              : BILLING_COPY.periodEnds
          }
          value={formatDate(
            billing.subscription_status === "trialing"
              ? billing.trial_ends_at
              : billing.current_period_ends_at,
          )}
        />
      </div>
      {billing.cancel_at_period_end ? (
        <p className="border-t border-border-subtle pt-4 text-sm text-warning">
          {BILLING_COPY.scheduledCancellation}
        </p>
      ) : null}
    </section>
  );
}
