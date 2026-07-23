"use client";

import { format } from "date-fns";
import { es } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
import { useState } from "react";
import type { Matcher } from "react-day-picker";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const fieldClassName =
  "w-full rounded-xl border border-border bg-surface px-3 py-2.5 text-sm text-ink outline-none ring-primary focus:ring-2";

function pad(value: number) {
  return String(value).padStart(2, "0");
}

type AppDateFieldProps = {
  value: Date | null;
  onChange: (value: Date) => void;
  mode?: "date" | "datetime-local";
  minDate?: Date;
  maxDate?: Date;
  disabledDays?: Matcher | Matcher[];
  minTime?: string;
  maxTime?: string;
  roundTimeToMinutes?: number;
};

export default function AppDateField({
  value,
  onChange,
  mode = "date",
  minDate,
  maxDate,
  disabledDays,
  minTime,
  maxTime,
  roundTimeToMinutes,
}: AppDateFieldProps) {
  const [open, setOpen] = useState(false);
  const timeValue = value
    ? `${pad(value.getHours())}:${pad(value.getMinutes())}`
    : "";
  const inputValue = value ? format(value, "yyyy-MM-dd") : "";

  const handleDateSelect = (selected: Date | undefined) => {
    if (!selected) {
      return;
    }

    const next = new Date(selected);
    if (mode === "datetime-local" && value) {
      next.setHours(value.getHours(), value.getMinutes(), 0, 0);
    }

    if (mode === "datetime-local" && roundTimeToMinutes) {
      const roundedMinutes =
        Math.round(next.getMinutes() / roundTimeToMinutes) * roundTimeToMinutes;
      next.setMinutes(roundedMinutes, 0, 0);
    }

    onChange(next);

    if (mode === "date") {
      setOpen(false);
    }
  };

  const handleManualDateChange = (nextValue: string) => {
    const [year, month, day] = nextValue.split("-").map(Number);
    if (!year || !month || !day) {
      return;
    }

    const next = new Date(year, month - 1, day);
    if (mode === "datetime-local" && value) {
      next.setHours(value.getHours(), value.getMinutes(), 0, 0);
    }

    onChange(next);
  };

  const handleTimeChange = (nextTime: string) => {
    if (!value) {
      return;
    }

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
      <div className="relative">
        <Input
          type="date"
          value={inputValue}
          min={minDate ? format(minDate, "yyyy-MM-dd") : undefined}
          max={maxDate ? format(maxDate, "yyyy-MM-dd") : undefined}
          onChange={(event) => handleManualDateChange(event.target.value)}
          aria-label="Editar fecha manualmente"
          className={`${fieldClassName} pr-11 [&::-webkit-calendar-picker-indicator]:hidden`}
        />
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label="Abrir calendario"
            className="absolute top-1/2 right-1.5 size-8 -translate-y-1/2 text-ink-muted hover:bg-primary-subtle hover:text-ink"
          >
            <CalendarIcon className="size-4" />
          </Button>
        </PopoverTrigger>
      </div>
      <PopoverContent
        className="z-100 w-auto rounded-[14px] border border-border/60 bg-surface p-0 shadow-float"
        align="start"
      >
        <Calendar
          mode="single"
          selected={value ?? undefined}
          defaultMonth={value ?? maxDate}
          onSelect={handleDateSelect}
          locale={es}
          captionLayout="dropdown"
          startMonth={minDate}
          endMonth={maxDate}
          disabled={[
            ...(minDate ? [{ before: minDate }] : []),
            ...(maxDate ? [{ after: maxDate }] : []),
            ...(disabledDays
              ? Array.isArray(disabledDays)
                ? disabledDays
                : [disabledDays]
              : []),
          ]}
          className="bg-transparent p-3"
        />
        {mode === "datetime-local" ? (
          <div className="border-t border-border-subtle px-3 py-3">
            <Input
              type="time"
              value={timeValue}
              min={minTime}
              max={maxTime}
              onChange={(event) => handleTimeChange(event.target.value)}
              className="rounded-xl border-border bg-canvas"
            />
          </div>
        ) : null}
      </PopoverContent>
    </Popover>
  );
}
