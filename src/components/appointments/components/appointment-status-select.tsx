"use client";

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

const statusColors: Record<AppointmentStatus, string> = {
  scheduled: "#6366f1",
  confirmed: "#eab308",
  in_progress: "#f97316",
  completed: "#14b8a6",
  cancelled: "#f43f5e",
  no_show: "#64748b",
};

const statusOptions = allStatuses.map((s) => ({
  value: s,
  label: appointmentStatusLabel(s),
  leading: (
    <span
      className="h-2 w-2 shrink-0 rounded-full"
      style={{ backgroundColor: statusColors[s] }}
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
          style={{ backgroundColor: statusColors[resolvedStatus] }}
        />
      }
    />
  );
}
