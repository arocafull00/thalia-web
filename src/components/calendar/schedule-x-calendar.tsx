"use client";

import "@schedule-x/theme-default/dist/index.css";

import { ScheduleXCalendarInner } from "@/components/calendar/components/schedule-x-calendar-inner";
import { DAY_HEADER_HEIGHT, MIN_WEEK_GRID_HEIGHT } from "@/lib/calendar-grid";
import { useActiveClinicTimezone } from "@/lib/hooks/use-active-clinic";
import { useElementHeight } from "@/lib/hooks/use-element-height";

export default function ScheduleXCalendar() {
  const timezone = useActiveClinicTimezone();
  const { ref, height } = useElementHeight<HTMLDivElement>();
  const gridHeight = height
    ? Math.max(height - DAY_HEADER_HEIGHT, MIN_WEEK_GRID_HEIGHT)
    : null;

  return (
    <div ref={ref} className="sx-react-calendar-wrapper h-full w-full">
      {gridHeight ? (
        <ScheduleXCalendarInner
          key={`${gridHeight}-${timezone}`}
          gridHeight={gridHeight}
        />
      ) : null}
    </div>
  );
}
