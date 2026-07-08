import Link from "next/link";

import type { AgendaAppointment } from "@/lib/calendar-agenda";
import { formatTime } from "@/lib/format";

type DayAgendaAppointmentCardProps = {
  appointment: AgendaAppointment;
};

export default function DayAgendaAppointmentCard({
  appointment,
}: DayAgendaAppointmentCardProps) {
  return (
    <Link
      href={`/appointments/${appointment.id}`}
      className="flex items-stretch gap-3 rounded-xl border border-border-subtle bg-surface p-3"
    >
      <span
        className={`w-1 shrink-0 rounded-full ${appointment.employeeColor ? "" : "bg-border"}`}
        style={
          appointment.employeeColor
            ? { backgroundColor: appointment.employeeColor }
            : undefined
        }
        aria-hidden
      />
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-center justify-between gap-2">
          <span className="truncate text-sm font-medium text-ink">
            {appointment.patientName}
          </span>
          <span className="shrink-0 text-xs tabular-nums text-ink-muted">
            {formatTime(appointment.startsAt)} –{" "}
            {formatTime(appointment.endsAt)}
          </span>
        </div>
        <span className="truncate text-xs text-ink-secondary">
          {appointment.treatmentName}
        </span>
        {appointment.employeeName ? (
          <span className="truncate text-xs text-ink-muted">
            {appointment.employeeName}
          </span>
        ) : null}
      </div>
    </Link>
  );
}
