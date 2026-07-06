import { ChevronLeft, ChevronRight } from "lucide-react";
import type { ReactNode } from "react";

import CalendarToolbarMobileMenu from "@/components/calendar/components/calendar-toolbar-mobile-menu";
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
    <div className="flex shrink-0 flex-wrap items-center gap-2 border-b border-border bg-surface px-4 py-3">
      <div className="hidden flex-1 items-center gap-2 md:flex">
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
      <div className="flex min-w-0 flex-1 items-center justify-center gap-2 sm:flex-none">
        <button
          type="button"
          aria-label={CALENDAR_COPY.toolbar.previousPeriod}
          onClick={onPrevious}
          className="flex min-h-11 min-w-11 items-center justify-center rounded-full border border-border text-ink-secondary hover:bg-canvas motion-reduce:transition-none"
        >
          <ChevronLeft size={16} />
        </button>
        <span className="min-w-[8rem] flex-1 text-center text-sm font-medium text-ink sm:w-52 sm:flex-none">
          {rangeLabel}
        </span>
        <button
          type="button"
          aria-label={CALENDAR_COPY.toolbar.nextPeriod}
          onClick={onNext}
          className="flex min-h-11 min-w-11 items-center justify-center rounded-full border border-border text-ink-secondary hover:bg-canvas motion-reduce:transition-none"
        >
          <ChevronRight size={16} />
        </button>
      </div>
      <div className="flex w-full flex-wrap items-center justify-end gap-2 sm:ml-auto sm:w-auto">
        <CalendarToolbarMobileMenu
          viewMode={viewMode}
          onToday={onToday}
          onChangeViewMode={onChangeViewMode}
        />
        {filter}
        <ActionButton
          title={CALENDAR_COPY.toolbar.newAppointment}
          onClick={onNewAppointment}
        />
      </div>
    </div>
  );
}
