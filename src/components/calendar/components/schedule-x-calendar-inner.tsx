"use client";

import { ScheduleXCalendar as ScheduleXCalendarView } from "@schedule-x/react";

import { useScheduleXCalendar } from "@/components/calendar/hooks/use-schedule-x-calendar";
import { SkeletonBlock } from "@/components/ui/primitives/skeleton-block";

export function ScheduleXCalendarInner({ gridHeight }: { gridHeight: number }) {
  const { calendarApp, customComponents, isLoading } =
    useScheduleXCalendar(gridHeight);

  return (
    <div className="relative h-full">
      <ScheduleXCalendarView
        calendarApp={calendarApp}
        customComponents={customComponents}
      />
      {isLoading ? (
        <div className="absolute inset-0 z-10 bg-surface p-6">
          <SkeletonBlock height={gridHeight} />
        </div>
      ) : null}
    </div>
  );
}
