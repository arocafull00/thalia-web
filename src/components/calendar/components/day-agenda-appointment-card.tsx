import Link from "next/link";

import type { AgendaAppointment } from "@/lib/calendar-agenda";
import { formatTime } from "@/lib/format";
import { cn } from "@/lib/utils";

type DayAgendaAppointmentCardProps = {
  appointment: AgendaAppointment;
  className?: string;
};

export default function DayAgendaAppointmentCard({
  appointment,
  className,
}: DayAgendaAppointmentCardProps) {
  return (
    <Link
      href={`/appointments/${appointment.id}`}
      className={cn(
        "flex shrink-0 overflow-hidden rounded-card border border-border/60 bg-surface",
        className,
      )}
    >
      <span
        className={cn(
          "w-1 shrink-0",
          appointment.employeeColor ? "" : "bg-primary/40",
        )}
        style={
          appointment.employeeColor
            ? { backgroundColor: appointment.employeeColor }
            : undefined
        }
        aria-hidden
      />
      <div className="flex min-w-0 flex-1 flex-col gap-1 p-3">
        <div className="flex items-start justify-between gap-2">
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
