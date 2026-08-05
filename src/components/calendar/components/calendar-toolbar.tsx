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
  statusBadge?: ReactNode;
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
  statusBadge,
  onPrevious,
  onNext,
  onToday,
  onChangeViewMode,
  onOpenFiltersSheet,
}: CalendarToolbarProps) {
  return (
    <div className="flex shrink-0 items-center border-border-subtle bg-surface px-4 py-3">
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
          {statusBadge}
        </div>
      </div>
      <div className="flex shrink-0 items-center justify-center gap-2">
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          aria-label={CALENDAR_COPY.toolbar.previousPeriod}
          onClick={onPrevious}
          className="rounded-button motion-reduce:transition-none"
        >
          <ChevronLeft size={16} strokeWidth={1.5} />
        </Button>
        <span
          data-testid="calendar-range-label"
          className="w-36 truncate text-center text-sm text-ink-secondary sm:w-52"
        >
          {rangeLabel}
        </span>
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          aria-label={CALENDAR_COPY.toolbar.nextPeriod}
          onClick={onNext}
          className="rounded-button motion-reduce:transition-none"
        >
          <ChevronRight size={16} strokeWidth={1.5} />
        </Button>
      </div>
      <div className="flex min-w-0 flex-1 items-center justify-end gap-2">
        <div className="hidden md:block">{filter}</div>
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          onClick={onOpenFiltersSheet}
          aria-label={CALENDAR_COPY.toolbar.filters}
          className="rounded-button md:hidden motion-reduce:transition-none"
        >
          <SlidersHorizontal size={16} strokeWidth={1.5} />
        </Button>
      </div>
    </div>
  );
}
