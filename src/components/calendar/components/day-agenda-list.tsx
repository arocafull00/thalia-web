import DayAgendaAppointmentCard from "@/components/calendar/components/day-agenda-appointment-card";
import { CALENDAR_COPY } from "@/copy/calendar-copy";
import type { AgendaAppointment } from "@/lib/calendar-agenda";
import {
  appointmentLayout,
  getAgendaHours,
  GRID_HEIGHT,
  HOUR_HEIGHT,
  layoutOverlappingAppointments,
  TIME_COLUMN_WIDTH,
} from "@/lib/calendar-grid";

type DayAgendaListProps = {
  day: Date;
  appointments: AgendaAppointment[];
};

export default function DayAgendaList({
  day,
  appointments,
}: DayAgendaListProps) {
  if (appointments.length === 0) {
    return (
      <div className="flex flex-1 items-center justify-center px-6 py-16 text-center text-sm text-ink-secondary">
        {CALENDAR_COPY.agenda.empty}
      </div>
    );
  }

  const hours = getAgendaHours();
  const columnLayout = layoutOverlappingAppointments(
    appointments.map((appointment) => ({
      id: appointment.id,
      starts_at: appointment.startsAt.toISOString(),
      ends_at: appointment.endsAt.toISOString(),
    })),
  );

  return (
    <div className="flex px-4 py-4">
      <div
        className="shrink-0 border-r border-border-subtle"
        style={{ width: TIME_COLUMN_WIDTH }}
      >
        {hours.map((hour) => (
          <div
            key={hour}
            className="relative flex justify-end pr-3"
            style={{ height: HOUR_HEIGHT }}
          >
            <span className="-mt-2 text-xs tabular-nums text-ink-muted">
              {`${String(hour).padStart(2, "0")}:00`}
            </span>
          </div>
        ))}
      </div>

      <div className="relative min-w-0 flex-1" style={{ height: GRID_HEIGHT }}>
        {hours.map((hour, index) => (
          <div
            key={hour}
            className="pointer-events-none absolute right-0 left-0 border-t border-dashed border-border-subtle"
            style={{ top: index * HOUR_HEIGHT }}
          />
        ))}

        {appointments.map((appointment) => {
          const position = appointmentLayout(
            appointment.startsAt,
            appointment.endsAt,
            day,
          );

          if (!position) {
            return null;
          }

          const columns = columnLayout.get(appointment.id);
          const columnCount = columns?.columnCount ?? 1;
          const columnIndex = columns?.columnIndex ?? 0;
          const widthPercent = 100 / columnCount;
          const leftPercent = columnIndex * widthPercent;

          return (
            <div
              key={appointment.id}
              className="absolute px-1"
              style={{
                top: position.top,
                height: position.height,
                left: `${leftPercent}%`,
                width: `${widthPercent}%`,
              }}
            >
              <DayAgendaAppointmentCard
                appointment={appointment}
                className="h-full"
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
