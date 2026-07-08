"use client";

import { ScheduleXCalendar as ScheduleXCalendarView } from "@schedule-x/react";

import { useScheduleXCalendar } from "@/components/calendar/hooks/use-schedule-x-calendar";

export function ScheduleXCalendarInner({ gridHeight }: { gridHeight: number }) {
  const { calendarApp, customComponents } = useScheduleXCalendar(gridHeight);

  return (
    <ScheduleXCalendarView
      calendarApp={calendarApp}
      customComponents={customComponents}
    />
  );
}
