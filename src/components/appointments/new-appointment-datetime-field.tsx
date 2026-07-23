"use client";

import AppDateField from "@/components/ui/app-date-field";
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
  const closedJsDays = clinic
    ? [1, 2, 3, 4, 5, 6, 7]
        .filter((d) => !clinic.open_days.includes(d))
        .map((d) => (d === 7 ? 0 : d))
    : [];

  const disabledDays =
    closedJsDays.length > 0 ? { dayOfWeek: closedJsDays } : undefined;

  const minTime = clinic ? clinic.opening_time.substring(0, 5) : undefined;
  const maxTime = clinic ? clinic.closing_time.substring(0, 5) : undefined;

  return (
    <AppDateField
      value={value}
      onChange={onChange}
      mode="datetime-local"
      roundTimeToMinutes={30}
      disabledDays={disabledDays}
      minTime={minTime}
      maxTime={maxTime}
    />
  );
}
