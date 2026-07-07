"use client";

import { endOfWeek, startOfWeek } from "date-fns";

import AppDateField from "@/components/ui/app-date-field";
import { APPOINTMENTS_COPY } from "@/copy/appointments-copy";
import { formatLocalDateInputValue } from "@/lib/date-input";

type AppointmentDateRangeProps = {
  from: Date;
  to: Date;
  onFromChange: (value: Date) => void;
  onToChange: (value: Date) => void;
};

export function getDefaultAppointmentDateRange() {
  const today = new Date();
  return {
    from: startOfWeek(today, { weekStartsOn: 1 }),
    to: endOfWeek(today, { weekStartsOn: 1 }),
  };
}

export function parseAppointmentDateParam(value: string, fallback: Date) {
  if (!value) {
    return fallback;
  }

  return new Date(`${value}T00:00:00`);
}

export function formatAppointmentDateParam(value: Date) {
  return formatLocalDateInputValue(value);
}

export default function AppointmentDateRange({
  from,
  to,
  onFromChange,
  onToChange,
}: AppointmentDateRangeProps) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <label className="flex items-center gap-2 text-sm text-ink-secondary">
        <span>{APPOINTMENTS_COPY.filters.dateFrom}</span>
        <AppDateField value={from} onChange={onFromChange} />
      </label>
      <label className="flex items-center gap-2 text-sm text-ink-secondary">
        <span>{APPOINTMENTS_COPY.filters.dateTo}</span>
        <AppDateField value={to} onChange={onToChange} />
      </label>
    </div>
  );
}
