"use client";

import { es } from "date-fns/locale";
import { CalendarIcon, ChevronDown } from "lucide-react";
import { useState } from "react";

import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { formatInputDate, formatInputDateTime } from "@/lib/format";

const fieldClassName =
  "flex w-full items-center justify-between gap-2 rounded-xl border border-border bg-surface px-3 py-2.5 text-sm text-ink outline-none ring-primary focus:ring-2";

function pad(value: number) {
  return String(value).padStart(2, "0");
}

type AppDateFieldProps = {
  value: Date;
  onChange: (value: Date) => void;
  mode?: "date" | "datetime-local";
};

export default function AppDateField({
  value,
  onChange,
  mode = "date",
}: AppDateFieldProps) {
  const [open, setOpen] = useState(false);
  const label =
    mode === "datetime-local"
      ? formatInputDateTime(value)
      : formatInputDate(value);
  const timeValue = `${pad(value.getHours())}:${pad(value.getMinutes())}`;

  const handleDateSelect = (selected: Date | undefined) => {
    if (!selected) {
      return;
    }

    const next = new Date(selected);
    if (mode === "datetime-local") {
      next.setHours(value.getHours(), value.getMinutes(), 0, 0);
    }

    onChange(next);

    if (mode === "date") {
      setOpen(false);
    }
  };

  const handleTimeChange = (nextTime: string) => {
    const [hours, minutes] = nextTime.split(":").map(Number);
    if (Number.isNaN(hours) || Number.isNaN(minutes)) {
      return;
    }

    const next = new Date(value);
    next.setHours(hours, minutes, 0, 0);
    onChange(next);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button type="button" className={fieldClassName}>
          <span className="flex min-w-0 items-center gap-2">
            <CalendarIcon className="size-4 shrink-0 text-ink-muted" />
            <span className="truncate">{label}</span>
          </span>
          <ChevronDown className="size-4 shrink-0 text-ink-muted" />
        </button>
      </PopoverTrigger>
      <PopoverContent
        className="z-100 w-auto rounded-[14px] border border-border/60 bg-surface p-0 shadow-float"
        align="start"
      >
        <Calendar
          mode="single"
          selected={value}
          onSelect={handleDateSelect}
          locale={es}
          className="bg-transparent p-3"
        />
        {mode === "datetime-local" ? (
          <div className="border-t border-border-subtle px-3 py-3">
            <Input
              type="time"
              value={timeValue}
              onChange={(event) => handleTimeChange(event.target.value)}
              className="rounded-xl border-border bg-canvas"
            />
          </div>
        ) : null}
      </PopoverContent>
    </Popover>
  );
}
