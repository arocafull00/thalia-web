"use client";

import AppDateField from "@/components/ui/app-date-field";

type NewPatientDateFieldProps = {
  value: Date | null;
  onChange: (value: Date) => void;
};

export default function NewPatientDateField({
  value,
  onChange,
}: NewPatientDateFieldProps) {
  return (
    <AppDateField
      value={value}
      onChange={onChange}
      minDate={new Date(1900, 0, 1)}
      maxDate={new Date()}
    />
  );
}
