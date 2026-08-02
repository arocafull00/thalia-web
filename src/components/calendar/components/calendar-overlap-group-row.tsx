"use client";

import AppointmentStatusBadge from "@/components/appointments/components/appointment-status-badge";
import { CALENDAR_COPY } from "@/copy/calendar-copy";
import { formatTime, getTreatmentName } from "@/lib/format";
import { useActiveClinicTimezone } from "@/lib/hooks/use-active-clinic";
import { cn } from "@/lib/utils";
import type { AppointmentWithRelations } from "@/types/database.types";

type CalendarOverlapGroupRowProps = {
  appointment: AppointmentWithRelations;
  onSelect: (appointmentId: string) => void;
};

export default function CalendarOverlapGroupRow({
  appointment,
  onSelect,
}: CalendarOverlapGroupRowProps) {
  const timezone = useActiveClinicTimezone();
  const patientName =
    appointment.patients?.full_name ?? CALENDAR_COPY.event.defaultPatient;
  const treatmentName = getTreatmentName(appointment);
  const employeeName = appointment.employees?.full_name;
  const employeeColor = appointment.employees?.color;
  const startsAt = new Date(appointment.starts_at);

  return (
    <button
      type="button"
      onClick={() => onSelect(appointment.id)}
      className="grid w-full grid-cols-[12px_1fr_auto] items-start gap-2.5 border-b border-border-subtle py-3.5 text-left transition-colors hover:bg-canvas"
    >
      <span
        className={cn(
          "mt-1 size-3 shrink-0 rounded-full",
          employeeColor ? "" : "bg-border",
        )}
        style={employeeColor ? { backgroundColor: employeeColor } : undefined}
      />
      <div className="min-w-0">
        <h3 className="truncate text-sm font-medium text-ink">{patientName}</h3>
        <p className="mt-1 truncate text-xs text-ink-muted">
          {formatTime(startsAt, timezone)} · {treatmentName}
          {employeeName ? ` · ${employeeName}` : ""}
        </p>
      </div>
      <AppointmentStatusBadge status={appointment.status} />
    </button>
  );
}
