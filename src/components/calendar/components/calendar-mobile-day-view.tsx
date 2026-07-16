"use client";

import DayAgendaList from "@/components/calendar/components/day-agenda-list";
import { useCalendarDayAgenda } from "@/components/calendar/hooks/use-calendar-day-agenda";
import { formatFullDayLabel } from "@/lib/calendar-grid";

export default function CalendarMobileDayView() {
  const { day, agenda } = useCalendarDayAgenda();

  return (
    <div className="flex h-full flex-col overflow-y-auto">
      <div className="shrink-0 border-b border-border-subtle px-4 py-3">
        <p className="text-sm font-medium text-ink">
          {formatFullDayLabel(day)}
        </p>
      </div>
      <DayAgendaList day={day} appointments={agenda} />
    </div>
  );
}
