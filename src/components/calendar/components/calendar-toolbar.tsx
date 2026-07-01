import { ChevronLeft, ChevronRight } from "lucide-react";
import type { ReactNode } from "react";

import { ActionButton } from "@/components/ui/primitives/action-button";
import { CALENDAR_COPY } from "@/copy/calendar-copy";

type CalendarToolbarProps = {
  weekRangeLabel: string;
  filter: ReactNode;
  onPreviousWeek: () => void;
  onNextWeek: () => void;
  onToday: () => void;
  onNewAppointment: () => void;
};

export default function CalendarToolbar({
  weekRangeLabel,
  filter,
  onPreviousWeek,
  onNextWeek,
  onToday,
  onNewAppointment,
}: CalendarToolbarProps) {
  return (
    <div className="flex shrink-0 items-center gap-3 border-b border-border bg-surface px-4 py-3">
      <div className="flex min-w-0 flex-1 items-center gap-3">
        <div className="flex min-w-0 items-center gap-2">
          <span className="truncate text-sm font-medium text-ink">
            {weekRangeLabel}
          </span>
        </div>
        <button
          type="button"
          aria-label={CALENDAR_COPY.toolbar.previousWeek}
          onClick={onPreviousWeek}
          className="rounded-full border border-border p-2 text-ink-secondary hover:bg-canvas"
        >
          <ChevronLeft size={16} />
        </button>
        <button
          type="button"
          aria-label={CALENDAR_COPY.toolbar.nextWeek}
          onClick={onNextWeek}
          className="rounded-full border border-border p-2 text-ink-secondary hover:bg-canvas"
        >
          <ChevronRight size={16} />
        </button>
        <button
          type="button"
          onClick={onToday}
          className="rounded-full border border-border px-3 py-1.5 text-xs font-medium text-ink-secondary hover:bg-canvas"
        >
          {CALENDAR_COPY.toolbar.today}
        </button>
      </div>
      <div className="flex items-center gap-3">
        {filter}
        <ActionButton
          title={CALENDAR_COPY.toolbar.newAppointment}
          onClick={onNewAppointment}
        />
      </div>
    </div>
  );
}
