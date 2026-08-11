"use client";

import "@schedule-x/theme-default/dist/index.css";

import { ScheduleXCalendarInner } from "@/components/calendar/components/schedule-x-calendar-inner";
import { DAY_HEADER_HEIGHT } from "@/lib/calendar-grid";
import { useActiveClinicTimezone } from "@/lib/hooks/use-active-clinic";
import type { ClinicInfo } from "@/lib/hooks/use-clinic-info";
import { useElementHeight } from "@/lib/hooks/use-element-height";

type ScheduleXCalendarProps = {
  clinic: ClinicInfo | null;
};

export default function ScheduleXCalendar({ clinic }: ScheduleXCalendarProps) {
  const activeClinicTimezone = useActiveClinicTimezone();
  const timezone = clinic?.timezone ?? activeClinicTimezone;
  const { ref, height } = useElementHeight<HTMLDivElement>();
  const availableGridHeight = height
    ? Math.max(height - DAY_HEADER_HEIGHT, 0)
    : null;

  return (
    <div ref={ref} className="sx-react-calendar-wrapper h-full w-full">
      {availableGridHeight ? (
        <ScheduleXCalendarInner
          key={timezone}
          availableGridHeight={availableGridHeight}
          clinic={clinic}
        />
      ) : null}
    </div>
  );
}
