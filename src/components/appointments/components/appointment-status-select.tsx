"use client";

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

export default function AppointmentStatusSelect({
  status,
  onChange,
  disabled,
}: AppointmentStatusSelectProps) {
  const resolvedStatus = status ?? "scheduled";
  const color = statusColors[resolvedStatus];

  return (
    <select
      value={resolvedStatus}
      disabled={disabled}
      onChange={(e) => onChange(e.target.value as AppointmentStatus)}
      className="cursor-pointer rounded-full border px-3 py-1 text-[11px] font-medium uppercase tracking-wide text-white outline-none transition-colors focus:ring-2 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
      style={{ backgroundColor: color, borderColor: color }}
    >
      {allStatuses.map((s) => (
        <option key={s} value={s}>
          {appointmentStatusLabel(s)}
        </option>
      ))}
    </select>
  );
}
