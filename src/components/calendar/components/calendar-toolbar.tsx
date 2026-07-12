import { ChevronLeft, ChevronRight, SlidersHorizontal } from "lucide-react";
import type { ReactNode } from "react";

import CalendarViewModeToggle from "@/components/calendar/components/calendar-view-mode-toggle";
import { Button } from "@/components/ui/button";
import { CALENDAR_COPY } from "@/copy/calendar-copy";
import type { CalendarViewMode } from "@/stores/calendar-store";

type CalendarToolbarProps = {
  rangeLabel: string;
  viewMode: CalendarViewMode;
  filter: ReactNode;
  onPrevious: () => void;
  onNext: () => void;
  onToday: () => void;
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
  onChangeViewMode,
  onOpenFiltersSheet,
}: CalendarToolbarProps) {
  return (
    <div className="flex shrink-0 items-center border-b border-border-subtle bg-surface px-4 py-3">
      <div className="flex min-w-0 flex-1 items-center justify-start gap-2">
        <div className="hidden items-center gap-2 md:flex">
          <CalendarViewModeToggle
            viewMode={viewMode}
            onChange={onChangeViewMode}
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onToday}
            className="h-10 rounded-xl px-4"
          >
            {CALENDAR_COPY.toolbar.today}
          </Button>
        </div>
      </div>
      <div className="flex shrink-0 items-center justify-center gap-2">
        <button
          type="button"
          aria-label={CALENDAR_COPY.toolbar.previousPeriod}
          onClick={onPrevious}
          className="flex size-8 items-center justify-center rounded-button text-ink-muted hover:bg-[var(--hover-overlay)] motion-reduce:transition-none"
        >
          <ChevronLeft size={16} strokeWidth={1.5} />
        </button>
        <span className="w-36 truncate text-center text-sm text-ink-secondary sm:w-52">
          {rangeLabel}
        </span>
        <button
          type="button"
          aria-label={CALENDAR_COPY.toolbar.nextPeriod}
          onClick={onNext}
          className="flex size-8 items-center justify-center rounded-button text-ink-muted hover:bg-[var(--hover-overlay)] motion-reduce:transition-none"
        >
          <ChevronRight size={16} strokeWidth={1.5} />
        </button>
      </div>
      <div className="flex min-w-0 flex-1 items-center justify-end gap-2">
        <div className="hidden md:block">{filter}</div>
        <button
          type="button"
          onClick={onOpenFiltersSheet}
          aria-label={CALENDAR_COPY.toolbar.filters}
          className="inline-flex size-8 shrink-0 items-center justify-center rounded-button text-ink-muted hover:bg-[var(--hover-overlay)] md:hidden motion-reduce:transition-none"
        >
          <SlidersHorizontal size={16} strokeWidth={1.5} />
        </button>
      </div>
    </div>
  );
}
