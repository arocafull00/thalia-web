"use client";

import "@schedule-x/theme-default/dist/index.css";

import { ScheduleXCalendarInner } from "@/components/calendar/components/schedule-x-calendar-inner";
import { DAY_HEADER_HEIGHT } from "@/lib/calendar-grid";
import { useElementHeight } from "@/lib/hooks/use-element-height";

export default function ScheduleXCalendar() {
  const { ref, height } = useElementHeight<HTMLDivElement>();
  const gridHeight = height ? Math.max(height - DAY_HEADER_HEIGHT, 300) : null;

  return (
    <div ref={ref} className="sx-react-calendar-wrapper h-full w-full">
      {gridHeight ? (
        <ScheduleXCalendarInner key={gridHeight} gridHeight={gridHeight} />
      ) : null}
    </div>
  );
}
