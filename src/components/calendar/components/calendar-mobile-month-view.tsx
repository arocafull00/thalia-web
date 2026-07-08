"use client";

import CalendarMobileMonthAppointments from "@/components/calendar/components/calendar-mobile-month-appointments";
import MonthMiniCalendar from "@/components/calendar/components/month-mini-calendar";
import { useCalendarMobileMonth } from "@/components/calendar/hooks/use-calendar-mobile-month";

export default function CalendarMobileMonthView() {
  const {
    monthAnchor,
    hasAppointmentsOnDay,
    selectedDay,
    selectedDayLabel,
    selectedDayAgenda,
    onSelectDay,
    onCreateAppointment,
  } = useCalendarMobileMonth();

  return (
    <div className="h-full overflow-y-auto">
      <MonthMiniCalendar
        month={monthAnchor}
        selectedDay={selectedDay}
        hasAppointmentsOnDay={hasAppointmentsOnDay}
        onSelectDay={onSelectDay}
      />
      <CalendarMobileMonthAppointments
        day={selectedDay}
        dayLabel={selectedDayLabel}
        appointments={selectedDayAgenda}
        onCreateAppointment={onCreateAppointment}
      />
    </div>
  );
}
