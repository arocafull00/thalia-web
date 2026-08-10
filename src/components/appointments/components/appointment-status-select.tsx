"use client";

import { APPOINTMENT_STATUS_COLOR } from "@/components/appointments/appointment-status-color";
import AppSearchableCombobox from "@/components/ui/app-searchable-combobox";
import { appointmentStatusLabel } from "@/lib/format";
import type { AppointmentStatus } from "@/types/database.types";

type AppointmentStatusSelectProps = {
  status: AppointmentStatus | null;
  onChange: (status: AppointmentStatus) => void;
  disabled?: boolean;
};

const allStatuses: AppointmentStatus[] = [
  "scheduled",
  "confirmed",
  "in_progress",
  "completed",
  "cancelled",
  "no_show",
];

const statusOptions = allStatuses.map((s) => ({
  value: s,
  label: appointmentStatusLabel(s),
  leading: (
    <span
      className="h-2 w-2 shrink-0 rounded-full"
      style={{ backgroundColor: APPOINTMENT_STATUS_COLOR[s] }}
    />
  ),
}));

export default function AppointmentStatusSelect({
  status,
  onChange,
  disabled,
}: AppointmentStatusSelectProps) {
  const resolvedStatus = status ?? "scheduled";

  return (
    <AppSearchableCombobox
      value={resolvedStatus}
      onValueChange={(value) => {
        if (value) onChange(value as AppointmentStatus);
      }}
      options={statusOptions}
      variant="pill"
      showSearch={false}
      disabled={disabled}
      triggerLeading={
        <span
          className="h-2 w-2 shrink-0 rounded-full"
          style={{ backgroundColor: APPOINTMENT_STATUS_COLOR[resolvedStatus] }}
        />
      }
    />
  );
}
