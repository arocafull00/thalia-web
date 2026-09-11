"use client";

import DayAgendaList from "@/components/calendar/components/day-agenda-list";
import { useCalendarDayAgenda } from "@/components/calendar/hooks/use-calendar-day-agenda";
import {
  formatFullDayLabel,
  getAgendaHours,
  getClinicCalendarHourRange,
} from "@/lib/calendar-grid";
import type { ClinicInfo } from "@/lib/hooks/use-clinic-info";

type CalendarMobileDayViewProps = {
  clinic: ClinicInfo | null;
  onAppointmentClick: (appointmentId: string) => void;
};

export default function CalendarMobileDayView({
  clinic,
  onAppointmentClick,
}: CalendarMobileDayViewProps) {
  const { day, agenda } = useCalendarDayAgenda();
  const hourRange = getClinicCalendarHourRange(
    clinic?.opening_time,
    clinic?.closing_time,
  );
  const hours = getAgendaHours(hourRange);

  return (
    <div className="flex h-full flex-col overflow-y-auto">
      <div className="shrink-0 border-b border-border-subtle px-4 py-3">
        <p className="text-sm font-medium text-ink">
          {formatFullDayLabel(day)}
        </p>
      </div>
      <DayAgendaList
        day={day}
        hours={hours}
        appointments={agenda}
        onAppointmentClick={onAppointmentClick}
      />
    </div>
  );
}
