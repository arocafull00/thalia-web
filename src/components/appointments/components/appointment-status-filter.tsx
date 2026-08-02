"use client";

import AppSearchableCombobox from "@/components/ui/app-searchable-combobox";
import { APPOINTMENTS_COPY } from "@/copy/appointments-copy";
import type { AppointmentStatus } from "@/types/database.types";

type AppointmentStatusFilterProps = {
  id?: string;
  active: string;
  onChange: (value: string) => void;
};

const statusOptions: Array<{ label: string; value: AppointmentStatus }> = [
  { label: APPOINTMENTS_COPY.filters.scheduled, value: "scheduled" },
  { label: APPOINTMENTS_COPY.filters.confirmed, value: "confirmed" },
  { label: APPOINTMENTS_COPY.filters.inProgress, value: "in_progress" },
  { label: APPOINTMENTS_COPY.filters.completed, value: "completed" },
  { label: APPOINTMENTS_COPY.filters.cancelled, value: "cancelled" },
  { label: APPOINTMENTS_COPY.filters.noShow, value: "no_show" },
];

export { statusOptions as appointmentStatusOptions };

export default function AppointmentStatusFilter({
  id,
  active,
  onChange,
}: AppointmentStatusFilterProps) {
  return (
    <div className="min-w-0">
      <AppSearchableCombobox
        id={id}
        value={active || null}
        onValueChange={(v) => onChange(v ?? "")}
        options={statusOptions}
        placeholder={APPOINTMENTS_COPY.filters.allStatuses}
        searchPlaceholder={APPOINTMENTS_COPY.filters.status}
        allowClear
        clearLabel={APPOINTMENTS_COPY.filters.allStatuses}
        variant="pill"
        className="w-full"
      />
    </div>
  );
}
