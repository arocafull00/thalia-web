import { ChevronLeft, ChevronRight, SlidersHorizontal } from "lucide-react";
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
  onOpenFiltersSheet: () => void;
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
  onOpenFiltersSheet,
}: CalendarToolbarProps) {
  return (
    <div className="flex shrink-0 items-center gap-2 border-b border-border bg-surface px-4 py-3">
      <div className="flex min-w-0 flex-1 items-center justify-start gap-2">
        <div className="hidden items-center gap-2 md:flex">
          <div className="flex rounded-full border border-border bg-canvas p-0.5">
            <button
              type="button"
              onClick={() => onChangeViewMode("week")}
              className={`min-h-11 rounded-full px-3 py-1 text-xs font-medium transition motion-reduce:transition-none ${
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
              className={`min-h-11 rounded-full px-3 py-1 text-xs font-medium transition motion-reduce:transition-none ${
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
            className="min-h-11 rounded-full border border-border px-3 py-1.5 text-xs font-medium text-ink-secondary hover:bg-canvas motion-reduce:transition-none"
          >
            {CALENDAR_COPY.toolbar.today}
          </button>
        </div>
        {filter}
      </div>
      <div className="flex shrink-0 items-center justify-center gap-2">
        <button
          type="button"
          aria-label={CALENDAR_COPY.toolbar.previousPeriod}
          onClick={onPrevious}
          className="flex min-h-11 min-w-11 items-center justify-center rounded-full text-ink-secondary hover:bg-canvas motion-reduce:transition-none"
        >
          <ChevronLeft size={16} />
        </button>
        <span className="w-36 truncate text-center text-sm font-medium text-ink sm:w-52">
          {rangeLabel}
        </span>
        <button
          type="button"
          aria-label={CALENDAR_COPY.toolbar.nextPeriod}
          onClick={onNext}
          className="flex min-h-11 min-w-11 items-center justify-center rounded-full text-ink-secondary hover:bg-canvas motion-reduce:transition-none"
        >
          <ChevronRight size={16} />
        </button>
      </div>
      <button
        type="button"
        onClick={onOpenFiltersSheet}
        aria-label={CALENDAR_COPY.toolbar.filters}
        className="inline-flex min-h-11 min-w-11 shrink-0 items-center justify-center rounded-full text-ink-secondary hover:bg-canvas md:hidden motion-reduce:transition-none"
      >
        <SlidersHorizontal size={16} />
      </button>
      <div className="hidden min-w-0 flex-1 items-center justify-end lg:flex">
        <ActionButton
          title={CALENDAR_COPY.toolbar.newAppointment}
          onClick={onNewAppointment}
        />
      </div>
    </div>
  );
}
