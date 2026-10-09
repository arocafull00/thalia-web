"use client";

import Link from "next/link";

import { DASHBOARD_COPY } from "@/components/dashboard/dashboard-copy";
import { Button } from "@/components/ui/button";
import type { AgendaAppointment } from "@/lib/calendar-agenda";
import { formatMinutesDuration, formatTime } from "@/lib/format";

type DashboardCurrentAppointmentCompactProps = {
  appointment: AgendaAppointment;
  timezone: string;
  /** Minutos que lleva pasada de su hora de fin. 0 cuando no procede. */
  overdueMinutes: number;
  completing: boolean;
  onComplete: () => void;
};

/**
 * Una cita en curso en una línea, para cuando hay muchas a la vez.
 *
 * Deja fuera la hora grande y el importe previsto: con cuatro o más personas
 * dentro, lo que se necesita saber es quién está y poder cerrar su cita, y el
 * detalle sigue a un clic. Diez de estas ocupan lo que dos tarjetas completas.
 */
export default function DashboardCurrentAppointmentCompact({
  appointment,
  timezone,
  overdueMinutes,
  completing,
  onComplete,
}: DashboardCurrentAppointmentCompactProps) {
  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 border-b border-border-subtle px-4 py-3 last:border-b-0">
      <span className="live-dot" aria-hidden="true" />
      <span className="font-numeric w-11 shrink-0 text-sm font-medium tabular-nums text-ink">
        {formatTime(appointment.startsAt, timezone)}
      </span>
      <Link
        href={`/appointments/${appointment.id}`}
        className="min-w-0 flex-1 basis-48 rounded-button outline-none focus-visible:ring-2 focus-visible:ring-primary"
      >
        <span className="block truncate text-sm font-medium text-ink">
          {appointment.patientName}
        </span>
        <span className="flex items-center gap-1.5 text-xs text-ink-secondary">
          <span
            aria-hidden="true"
            className={`size-2 shrink-0 rounded-full ${
              appointment.employeeColor ? "" : "bg-border-strong"
            }`}
            style={
              appointment.employeeColor
                ? { backgroundColor: appointment.employeeColor }
                : undefined
            }
          />
          <span className="truncate">
            {[appointment.treatmentName, appointment.employeeName]
              .filter(Boolean)
              .join(" · ")}
          </span>
        </span>
      </Link>
      {overdueMinutes > 0 ? (
        <span
          className="font-numeric shrink-0 text-xs font-medium tabular-nums text-live"
          title={DASHBOARD_COPY.current.overdueTitle}
        >
          {DASHBOARD_COPY.current.overdueBy(
            formatMinutesDuration(overdueMinutes),
          )}
        </span>
      ) : null}
      <Button
        size="xs"
        variant="outline"
        onClick={onComplete}
        disabled={completing}
        className="shrink-0"
      >
        {DASHBOARD_COPY.current.complete}
      </Button>
    </div>
  );
}
