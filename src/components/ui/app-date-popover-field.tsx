"use client";

import AppDateField from "@/components/ui/app-date-field";

type AppDatePopoverFieldProps = {
  value: Date;
  onChange: (value: Date) => void;
};

export default function AppDatePopoverField({
  value,
  onChange,
}: AppDatePopoverFieldProps) {
  return <AppDateField value={value} onChange={onChange} />;
}
