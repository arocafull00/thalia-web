import { isSameDay, isSameMonth } from "date-fns";

import MonthMiniCalendarDay from "@/components/calendar/components/month-mini-calendar-day";
import { CALENDAR_COPY } from "@/copy/calendar-copy";
import { getMonthGridDays } from "@/lib/calendar-grid";

type MonthMiniCalendarProps = {
  month: Date;
  selectedDay: Date | null;
  hasAppointmentsOnDay: (day: Date) => boolean;
  onSelectDay: (day: Date) => void;
};

export default function MonthMiniCalendar({
  month,
  selectedDay,
  hasAppointmentsOnDay,
  onSelectDay,
}: MonthMiniCalendarProps) {
  const days = getMonthGridDays(month);

  return (
    <div className="flex flex-col gap-2 p-4">
      <div className="grid grid-cols-7 text-center text-xs font-medium text-ink-muted">
        {CALENDAR_COPY.month.weekdays.map((label, index) => (
          <span key={`${label}-${index}`}>{label}</span>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-y-1">
        {days.map((day) => (
          <MonthMiniCalendarDay
            key={day.toISOString()}
            day={day}
            isCurrentMonth={isSameMonth(day, month)}
            isSelected={selectedDay !== null && isSameDay(day, selectedDay)}
            hasAppointments={hasAppointmentsOnDay(day)}
            onSelect={onSelectDay}
          />
        ))}
      </div>
    </div>
  );
}
