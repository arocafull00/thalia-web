import DayAgendaHourRow from "@/components/calendar/components/day-agenda-hour-row";
import { CALENDAR_COPY } from "@/copy/calendar-copy";
import {
  groupAppointmentsByHour,
  type AgendaAppointment,
} from "@/lib/calendar-agenda";
import { getAgendaHours } from "@/lib/calendar-grid";

type DayAgendaListProps = {
  appointments: AgendaAppointment[];
};

export default function DayAgendaList({ appointments }: DayAgendaListProps) {
  if (appointments.length === 0) {
    return (
      <div className="flex flex-1 items-center justify-center px-6 py-16 text-center text-sm text-ink-secondary">
        {CALENDAR_COPY.agenda.empty}
      </div>
    );
  }

  const hours = getAgendaHours();
  const appointmentsByHour = groupAppointmentsByHour(appointments);

  return (
    <div className="flex flex-col divide-y divide-border-subtle">
      {hours.map((hour) => (
        <DayAgendaHourRow
          key={hour}
          hour={hour}
          appointments={appointmentsByHour.get(hour) ?? []}
        />
      ))}
    </div>
  );
}
