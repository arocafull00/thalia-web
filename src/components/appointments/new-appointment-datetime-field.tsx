"use client";

import { useId } from "react";

import AppointmentTimeField from "@/components/appointments/components/appointment-time-field";
import AppDateField from "@/components/ui/app-date-field";
import { APPOINTMENT_CREATE_COPY } from "@/copy/appointment-create-copy";
import type { ClinicInfo } from "@/lib/hooks/use-clinic-info";

type NewAppointmentDatetimeFieldProps = {
  value: Date;
  onChange: (value: Date) => void;
  clinic?: ClinicInfo | null;
};

export default function NewAppointmentDatetimeField({
  value,
  onChange,
  clinic,
}: NewAppointmentDatetimeFieldProps) {
  const dateFieldId = useId();
  const closedJsDays = clinic
    ? [1, 2, 3, 4, 5, 6, 7]
        .filter((d) => !clinic.open_days.includes(d))
        .map((d) => (d === 7 ? 0 : d))
    : [];

  const disabledDays =
    closedJsDays.length > 0 ? { dayOfWeek: closedJsDays } : undefined;

  const minTime = clinic ? clinic.opening_time.substring(0, 5) : undefined;
  const maxTime = clinic ? clinic.closing_time.substring(0, 5) : undefined;

  const handleDateChange = (nextDate: Date) => {
    const next = new Date(nextDate);
    next.setHours(value.getHours(), value.getMinutes(), 0, 0);
    onChange(next);
  };

  const handleTimeChange = (hours: number, minutes: number) => {
    const next = new Date(value);
    next.setHours(hours, minutes, 0, 0);
    onChange(next);
  };

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <div className="space-y-1.5">
        <label
          htmlFor={dateFieldId}
          className="block text-xs font-medium text-ink-muted"
        >
          {APPOINTMENT_CREATE_COPY.fields.date}
        </label>
        <AppDateField
          id={dateFieldId}
          value={value}
          onChange={handleDateChange}
          mode="date"
          disabledDays={disabledDays}
        />
      </div>
      <label className="block space-y-1.5">
        <span className="block text-xs font-medium text-ink-muted">
          {APPOINTMENT_CREATE_COPY.fields.time}
        </span>
        <AppointmentTimeField
          value={value}
          min={minTime}
          max={maxTime}
          onChange={handleTimeChange}
        />
      </label>
    </div>
  );
}
