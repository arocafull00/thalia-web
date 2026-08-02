"use client";

import { Input } from "@/components/ui/input";

function pad(value: number) {
  return String(value).padStart(2, "0");
}

type AppointmentTimeFieldProps = {
  value: Date;
  min?: string;
  max?: string;
  onChange: (hours: number, minutes: number) => void;
};

export default function AppointmentTimeField({
  value,
  min,
  max,
  onChange,
}: AppointmentTimeFieldProps) {
  const handleChange = (nextTime: string) => {
    const [hours, minutes] = nextTime.split(":").map(Number);

    if (Number.isNaN(hours) || Number.isNaN(minutes)) {
      return;
    }

    onChange(hours, minutes);
  };

  return (
    <Input
      type="time"
      value={`${pad(value.getHours())}:${pad(value.getMinutes())}`}
      min={min}
      max={max}
      onChange={(event) => handleChange(event.target.value)}
      className="w-full rounded-xl border border-border-field bg-surface px-3 py-2.5 text-sm tabular-nums text-ink outline-none ring-primary focus:ring-2"
    />
  );
}
