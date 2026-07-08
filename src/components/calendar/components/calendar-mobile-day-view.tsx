"use client";

import DayAgendaList from "@/components/calendar/components/day-agenda-list";
import { useCalendarDayAgenda } from "@/components/calendar/hooks/use-calendar-day-agenda";

export default function CalendarMobileDayView() {
  const { day, agenda } = useCalendarDayAgenda();

  return (
    <div className="flex h-full flex-col overflow-y-auto">
      <DayAgendaList day={day} appointments={agenda} />
    </div>
  );
}
