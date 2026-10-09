"use client";

import Link from "next/link";

import { DASHBOARD_COPY } from "@/components/dashboard/dashboard-copy";
import { Button } from "@/components/ui/button";
import type { AgendaAppointment } from "@/lib/calendar-agenda";
import {
  formatCurrency,
  formatMinutesDuration,
  formatTime,
} from "@/lib/format";

type DashboardCurrentAppointmentCardProps = {
  appointment: AgendaAppointment;
  timezone: string;
  /** `true` en la tarjeta de «Siguiente», que aún no se puede completar. */
  upcoming: boolean;
  /** Minutos que lleva pasada de su hora de fin. 0 cuando no procede. */
  overdueMinutes: number;
  completing: boolean;
  onComplete: () => void;
};

export default function DashboardCurrentAppointmentCard({
  appointment,
  timezone,
  upcoming,
  overdueMinutes,
  completing,
  onComplete,
}: DashboardCurrentAppointmentCardProps) {
  const overdue = overdueMinutes > 0;

  return (
    <article
      className={`surface-raised flex min-w-0 flex-1 basis-80 flex-wrap items-center gap-x-6 gap-y-4 rounded-card p-5 ${
        upcoming ? "" : "surface-live"
      }`}
    >
      <div className="flex shrink-0 flex-col gap-1 border-border-subtle pr-6 sm:border-r">
        <span
          className={`flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.14em] ${
            upcoming ? "text-primary" : "text-live"
          }`}
        >
          {upcoming ? null : <span className="live-dot" aria-hidden="true" />}
          {upcoming
            ? DASHBOARD_COPY.current.next
            : DASHBOARD_COPY.current.inProgress}
        </span>
        <span className="font-numeric text-4xl font-medium leading-none tracking-tight tabular-nums text-ink">
          {formatTime(appointment.startsAt, timezone)}
        </span>
        {overdue ? (
          <span
            className="font-numeric text-sm tabular-nums text-live"
            title={DASHBOARD_COPY.current.overdueTitle}
          >
            {DASHBOARD_COPY.current.overdueEndedAt(
              formatTime(appointment.endsAt, timezone),
            )}
            <span className="block text-xs font-medium">
              {DASHBOARD_COPY.current.overdueBy(
                formatMinutesDuration(overdueMinutes),
              )}
            </span>
          </span>
        ) : (
          <span className="font-numeric text-sm tabular-nums text-ink-secondary">
            {DASHBOARD_COPY.current.endsAt(
              formatTime(appointment.endsAt, timezone),
            )}
          </span>
        )}
      </div>

      <div className="min-w-0 flex-1 basis-48">
        <p className="truncate text-lg font-medium tracking-tight text-ink">
          {appointment.patientName}
        </p>
        <p className="mt-1 flex items-center gap-2 text-sm text-ink-secondary">
          {/* Círculo del profesional: color guardado en la base, así que va por
              `style`. Sin color, una clase del tema y nunca un hexadecimal. */}
          <span
            aria-hidden="true"
            className={`size-2.5 shrink-0 rounded-full ${
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
        </p>
        {/* Importe previsto: la cita no está completada, así que el ingreso
            todavía no existe en finanzas. */}
        {appointment.amount === null ? null : (
          <p className="mt-2 font-numeric text-sm tabular-nums text-ink-muted">
            {formatCurrency(appointment.amount)}{" "}
            <span className="text-[11px]">
              {DASHBOARD_COPY.agenda.expected}
            </span>
          </p>
        )}
      </div>

      <div className="flex shrink-0 flex-wrap gap-2">
        {upcoming ? null : (
          <Button onClick={onComplete} disabled={completing}>
            {DASHBOARD_COPY.current.complete}
          </Button>
        )}
        <Button asChild variant="outline">
          <Link href={`/appointments/${appointment.id}`}>
            {DASHBOARD_COPY.current.view}
          </Link>
        </Button>
      </div>
    </article>
  );
}
