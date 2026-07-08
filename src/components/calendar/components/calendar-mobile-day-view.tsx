"use client";

import DayAgendaList from "@/components/calendar/components/day-agenda-list";
import { useCalendarDayAgenda } from "@/components/calendar/hooks/use-calendar-day-agenda";

export default function CalendarMobileDayView() {
  const { agenda } = useCalendarDayAgenda();

  return (
    <div className="flex h-full flex-col overflow-y-auto">
      <DayAgendaList appointments={agenda} />
    </div>
  );
}
