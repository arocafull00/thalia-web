"use client";

import { AppDateField } from "@/components/ui/app-date-picker-popover";

type NewAppointmentDatetimeFieldProps = {
  value: Date;
  onChange: (value: Date) => void;
};

export default function NewAppointmentDatetimeField({
  value,
  onChange,
}: NewAppointmentDatetimeFieldProps) {
  return <AppDateField value={value} onChange={onChange} mode="datetime-local" />;
}
