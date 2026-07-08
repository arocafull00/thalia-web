import CalendarViewModeOption from "@/components/calendar/components/calendar-view-mode-option";
import { CALENDAR_COPY } from "@/copy/calendar-copy";
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
    <div className="flex rounded-full border border-border bg-canvas p-0.5">
      {options.map((option) => (
        <CalendarViewModeOption
          key={option.value}
          label={option.label}
          active={viewMode === option.value}
          fullWidth={fullWidth}
          onClick={() => onChange(option.value)}
        />
      ))}
    </div>
  );
}
