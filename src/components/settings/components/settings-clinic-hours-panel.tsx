"use client";

import { Clock, Globe, Pencil } from "lucide-react";

import ClinicInfoRow from "@/components/settings/components/clinic-info-row";
import { ActionButton } from "@/components/ui/primitives/action-button";
import { CLINIC_HOURS_COPY } from "@/copy/clinic-hours-copy";
import { SETTINGS_COPY } from "@/copy/settings-copy";
import type { ClinicInfo } from "@/lib/hooks/use-clinic-info";
import { useSettingsUiStore } from "@/stores/settings-ui-store";

type SettingsClinicHoursPanelProps = {
  clinic: ClinicInfo | null;
};

export default function SettingsClinicHoursPanel({
  clinic,
}: SettingsClinicHoursPanelProps) {
  const setHoursDialogOpen = useSettingsUiStore(
    (state) => state.setHoursDialogOpen,
  );
  const openDaysLabel = clinic
    ? CLINIC_HOURS_COPY.days
        .map((label, i) => ({ label, day: i + 1 }))
        .map(({ label, day }) => ({
          label,
          active: clinic.open_days.includes(day),
        }))
    : null;

  const hoursLabel = clinic
    ? `${clinic.opening_time.substring(0, 5)} – ${clinic.closing_time.substring(0, 5)}`
    : null;

  return (
    <section aria-labelledby="settings-clinic-hours-heading">
      <div className="flex items-center justify-between gap-4 border-b border-border-subtle pb-4">
        <h2
          id="settings-clinic-hours-heading"
          className="text-lg font-medium text-ink text-wrap-balance"
        >
          {SETTINGS_COPY.clinic.hours}
        </h2>
        <ActionButton
          title={CLINIC_HOURS_COPY.actions.edit}
          icon={Pencil}
          variant="ghost"
          onClick={() => setHoursDialogOpen(true)}
          disabled={!clinic}
        />
      </div>

      <div className="divide-y divide-border-subtle">
        <ClinicInfoRow
          icon={Clock}
          label={CLINIC_HOURS_COPY.fields.openingTime.replace(
            "apertura",
            "apertura / cierre",
          )}
          value={hoursLabel}
        />

        <div className="py-3">
          <p className="mb-2 text-xs text-ink-muted">
            {CLINIC_HOURS_COPY.fields.openDays}
          </p>
          <div className="flex gap-1.5">
            {openDaysLabel
              ? openDaysLabel.map(({ label, active }) => (
                  <span
                    key={label}
                    className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-medium ${
                      active
                        ? "bg-primary text-on-primary"
                        : "bg-surface text-ink-muted"
                    }`}
                  >
                    {label}
                  </span>
                ))
              : null}
          </div>
        </div>

        <ClinicInfoRow
          icon={Globe}
          label={CLINIC_HOURS_COPY.fields.timezone}
          value={clinic?.timezone ?? null}
        />
      </div>
    </section>
  );
}
