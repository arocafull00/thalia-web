import DayAgendaAppointmentCard from "@/components/calendar/components/day-agenda-appointment-card";
import { CALENDAR_COPY } from "@/copy/calendar-copy";
import {
  getAgendaHourRowHeight,
  groupAppointmentsByHour,
  type AgendaAppointment,
} from "@/lib/calendar-agenda";
import { getAgendaHours, TIME_COLUMN_WIDTH } from "@/lib/calendar-grid";
import { useActiveClinicTimezone } from "@/lib/hooks/use-active-clinic";

type DayAgendaListProps = {
  day: Date;
  appointments: AgendaAppointment[];
  onAppointmentClick: (appointmentId: string) => void;
};

export default function DayAgendaList({
  appointments,
  onAppointmentClick,
}: DayAgendaListProps) {
  const timezone = useActiveClinicTimezone();
  if (appointments.length === 0) {
    return (
      <div className="flex flex-1 items-center justify-center px-6 py-16 text-center text-sm text-ink-secondary">
        {CALENDAR_COPY.agenda.empty}
      </div>
    );
  }

  const hours = getAgendaHours();
  const appointmentsByHour = groupAppointmentsByHour(appointments, timezone);

  return (
    <div className="flex px-4 py-4">
      <div
        className="shrink-0 border-r border-border-subtle"
        style={{ width: TIME_COLUMN_WIDTH }}
      >
        {hours.map((hour) => {
          const hourAppointments = appointmentsByHour.get(hour) ?? [];
          const rowHeight = getAgendaHourRowHeight(hourAppointments.length);

          return (
            <div
              key={hour}
              className="relative flex justify-end pr-3"
              style={{ height: rowHeight }}
            >
              <span className="-mt-2 text-xs tabular-nums text-ink-muted">
                {`${String(hour).padStart(2, "0")}:00`}
              </span>
            </div>
          );
        })}
      </div>

      <div className="min-w-0 flex-1">
        {hours.map((hour) => {
          const hourAppointments = appointmentsByHour.get(hour) ?? [];
          const rowHeight = getAgendaHourRowHeight(hourAppointments.length);

          return (
            <div
              key={hour}
              className="flex flex-col gap-2 border-t border-dashed border-border-subtle px-1 py-1"
              style={{ minHeight: rowHeight }}
            >
              {hourAppointments.map((appointment) => (
                <DayAgendaAppointmentCard
                  key={appointment.id}
                  appointment={appointment}
                  onClick={() => onAppointmentClick(appointment.id)}
                />
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
}
