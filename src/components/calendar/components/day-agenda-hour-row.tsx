import DayAgendaAppointmentCard from "@/components/calendar/components/day-agenda-appointment-card";
import type { AgendaAppointment } from "@/lib/calendar-agenda";

type DayAgendaHourRowProps = {
  hour: number;
  appointments: AgendaAppointment[];
};

export default function DayAgendaHourRow({
  hour,
  appointments,
}: DayAgendaHourRowProps) {
  return (
    <div className="flex gap-3 px-4 py-3">
      <span className="w-12 shrink-0 pt-0.5 text-xs font-medium tabular-nums text-ink-muted">
        {`${String(hour).padStart(2, "0")}:00`}
      </span>
      <div className="flex min-w-0 flex-1 flex-col gap-2">
        {appointments.map((appointment) => (
          <DayAgendaAppointmentCard
            key={appointment.id}
            appointment={appointment}
          />
        ))}
      </div>
    </div>
  );
}
