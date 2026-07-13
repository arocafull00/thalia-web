"use client";

import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { CALENDAR_COPY } from "@/copy/calendar-copy";
import { cn } from "@/lib/utils";
import type { CalendarViewMode } from "@/stores/calendar-store";

const VIEW_MODE_OPTIONS: { value: CalendarViewMode; label: string }[] = [
  { value: "day", label: CALENDAR_COPY.toolbar.viewDay },
  { value: "week", label: CALENDAR_COPY.toolbar.viewWeek },
  { value: "month", label: CALENDAR_COPY.toolbar.viewMonth },
];

const DEFAULT_VIEW_MODES: CalendarViewMode[] = ["day", "week", "month"];

type CalendarViewModeToggleProps = {
  viewMode: CalendarViewMode;
  modes?: CalendarViewMode[];
  fullWidth?: boolean;
  onChange: (mode: CalendarViewMode) => void;
};

export default function CalendarViewModeToggle({
  viewMode,
  modes = DEFAULT_VIEW_MODES,
  fullWidth = false,
  onChange,
}: CalendarViewModeToggleProps) {
  const options = VIEW_MODE_OPTIONS.filter((option) =>
    modes.includes(option.value),
  );

  return (
    <ToggleGroup
      type="single"
      value={viewMode}
      onValueChange={(value) => {
        if (!value) return;
        onChange(value as CalendarViewMode);
      }}
      className={cn(fullWidth && "w-full")}
    >
      {options.map((option) => (
        <ToggleGroupItem
          key={option.value}
          value={option.value}
          aria-label={option.label}
          data-cuelume-toggle=""
          className={cn(fullWidth && "flex-1")}
        >
          {option.label}
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  );
}
