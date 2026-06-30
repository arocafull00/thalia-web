"use client";

import { ScheduleXCalendar as ScheduleXCalendarView } from "@schedule-x/react";
import "@schedule-x/theme-default/dist/index.css";

import { useScheduleXCalendar } from "@/components/calendar/hooks/use-schedule-x-calendar";

export default function ScheduleXCalendar() {
  const { calendarApp, customComponents } = useScheduleXCalendar();

  return (
    <div className="sx-react-calendar-wrapper h-full w-full">
      <ScheduleXCalendarView calendarApp={calendarApp} customComponents={customComponents} />
    </div>
  );
}
