"use client";

import type { AgendaAppointment } from "@/lib/calendar-agenda";
import { buildEventSurfaceColor } from "@/lib/calendar-event-surface";
import { formatTime } from "@/lib/format";
import { useActiveClinicTimezone } from "@/lib/hooks/use-active-clinic";
import { cn } from "@/lib/utils";

type DayAgendaAppointmentCardProps = {
  appointment: AgendaAppointment;
  className?: string;
  onClick: () => void;
};

export default function DayAgendaAppointmentCard({
  appointment,
  className,
  onClick,
}: DayAgendaAppointmentCardProps) {
  const timezone = useActiveClinicTimezone();
  const surfaceColor = buildEventSurfaceColor(appointment.employeeColor);

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex shrink-0 overflow-hidden rounded-card border border-border/60 text-left",
        surfaceColor ? "" : "bg-primary-subtle",
        className,
      )}
      style={surfaceColor ? { backgroundColor: surfaceColor } : undefined}
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
            {formatTime(appointment.startsAt, timezone)} –{" "}
            {formatTime(appointment.endsAt, timezone)}
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
    </button>
  );
}
