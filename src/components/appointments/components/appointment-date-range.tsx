"use client";

import * as Popover from "@radix-ui/react-popover";
import { format, endOfWeek, startOfWeek } from "date-fns";
import { es } from "date-fns/locale";
import { Calendar, ChevronDown } from "lucide-react";
import { useMemo, useState } from "react";

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

export function formatAppointmentDateRangeLabel(from: Date, to: Date) {
  const fromLabel = format(from, "dd MMM", { locale: es }).replace(/\./g, "");
  const toLabel = format(to, "dd MMM", { locale: es }).replace(/\./g, "");

  return `${fromLabel} – ${toLabel}`;
}

export default function AppointmentDateRange({
  from,
  to,
  onFromChange,
  onToChange,
}: AppointmentDateRangeProps) {
  const [open, setOpen] = useState(false);
  const rangeLabel = useMemo(
    () => formatAppointmentDateRangeLabel(from, to),
    [from, to],
  );

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger asChild>
        <button
          type="button"
          className="inline-flex w-full min-w-0 items-center justify-between gap-2 rounded-full border border-border bg-surface px-4 py-2 text-sm text-ink-secondary hover:bg-canvas motion-reduce:transition-none"
        >
          <span className="flex min-w-0 items-center gap-2">
            <Calendar size={16} className="shrink-0" />
            <span className="truncate">{rangeLabel}</span>
          </span>
          <ChevronDown size={16} className="shrink-0 text-ink-muted" />
        </button>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          className="pointer-events-auto z-100 w-72 rounded-2xl border border-border bg-surface p-4 shadow-lg"
          sideOffset={8}
          align="start"
        >
          <div className="flex flex-col gap-3">
            <label className="flex items-center justify-between gap-2 text-sm text-ink-secondary">
              <span>{APPOINTMENTS_COPY.filters.dateFrom}</span>
              <AppDateField value={from} onChange={onFromChange} />
            </label>
            <label className="flex items-center justify-between gap-2 text-sm text-ink-secondary">
              <span>{APPOINTMENTS_COPY.filters.dateTo}</span>
              <AppDateField value={to} onChange={onToChange} />
            </label>
          </div>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
