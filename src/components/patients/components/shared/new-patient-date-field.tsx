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
  return <AppDateField value={value ?? new Date()} onChange={onChange} />;
}
