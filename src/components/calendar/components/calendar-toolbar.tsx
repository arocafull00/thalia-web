import { ChevronLeft, ChevronRight } from "lucide-react";
import type { ReactNode } from "react";

import { ActionButton } from "@/components/ui/primitives/action-button";
import { CALENDAR_COPY } from "@/copy/calendar-copy";
import type { CalendarViewMode } from "@/stores/calendar-store";

type CalendarToolbarProps = {
  rangeLabel: string;
  viewMode: CalendarViewMode;
  filter: ReactNode;
  onPrevious: () => void;
  onNext: () => void;
  onToday: () => void;
  onNewAppointment: () => void;
  onChangeViewMode: (mode: CalendarViewMode) => void;
};

export default function CalendarToolbar({
  rangeLabel,
  viewMode,
  filter,
  onPrevious,
  onNext,
  onToday,
  onNewAppointment,
  onChangeViewMode,
}: CalendarToolbarProps) {
  return (
    <div className="flex shrink-0 items-center border-b border-border bg-surface px-4 py-3">
      <div className="flex flex-1 items-center gap-2">
        <div className="flex rounded-full border border-border bg-canvas p-0.5">
          <button
            type="button"
            onClick={() => onChangeViewMode("week")}
            className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
              viewMode === "week"
                ? "bg-primary text-on-primary"
                : "text-ink-secondary hover:text-ink"
            }`}
          >
            {CALENDAR_COPY.toolbar.viewWeek}
          </button>
          <button
            type="button"
            onClick={() => onChangeViewMode("month")}
            className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
              viewMode === "month"
                ? "bg-primary text-on-primary"
                : "text-ink-secondary hover:text-ink"
            }`}
          >
            {CALENDAR_COPY.toolbar.viewMonth}
          </button>
        </div>
        <button
          type="button"
          onClick={onToday}
          className="rounded-full border border-border px-3 py-1.5 text-xs font-medium text-ink-secondary hover:bg-canvas"
        >
          {CALENDAR_COPY.toolbar.today}
        </button>
      </div>
      <div className="flex items-center gap-2">
        <button
          type="button"
          aria-label={CALENDAR_COPY.toolbar.previousPeriod}
          onClick={onPrevious}
          className="rounded-full border border-border p-2 text-ink-secondary hover:bg-canvas"
        >
          <ChevronLeft size={16} />
        </button>
        <span className="w-52 text-center text-sm font-medium text-ink">
          {rangeLabel}
        </span>
        <button
          type="button"
          aria-label={CALENDAR_COPY.toolbar.nextPeriod}
          onClick={onNext}
          className="rounded-full border border-border p-2 text-ink-secondary hover:bg-canvas"
        >
          <ChevronRight size={16} />
        </button>
      </div>
      <div className="flex flex-1 items-center justify-end gap-3">
        {filter}
        <ActionButton
          title={CALENDAR_COPY.toolbar.newAppointment}
          onClick={onNewAppointment}
        />
      </div>
    </div>
  );
}
