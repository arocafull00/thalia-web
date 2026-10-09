"use client";

import DashboardCurrentAppointmentCard from "@/components/dashboard/components/dashboard-current-appointment-card";
import DashboardCurrentAppointmentCompact from "@/components/dashboard/components/dashboard-current-appointment-compact";
import { DASHBOARD_COPY } from "@/components/dashboard/dashboard-copy";
import type { DashboardDay } from "@/lib/dashboard-day";

type DashboardCurrentAppointmentsProps = {
  day: DashboardDay;
  timezone: string;
  completingId: string | null;
  onComplete: (id: string) => void;
};

export default function DashboardCurrentAppointments({
  day,
  timezone,
  completingId,
  onComplete,
}: DashboardCurrentAppointmentsProps) {
  if (day.state === "day-over" || day.state === "no-appointments") {
    return (
      <p className="surface-raised rounded-card px-5 py-4 text-sm text-ink-secondary">
        {day.state === "day-over"
          ? DASHBOARD_COPY.current.dayOver
          : DASHBOARD_COPY.current.noAppointments}
      </p>
    );
  }

  if (day.state === "next" && day.next) {
    return (
      <DashboardCurrentAppointmentCard
        appointment={day.next}
        timezone={timezone}
        upcoming
        overdueMinutes={0}
        completing={false}
        onComplete={() => undefined}
      />
    );
  }

  /*
   * Muchas a la vez: una lista de líneas en un solo bloque. Se ven todas y
   * ocupan lo que dos tarjetas completas, así que la agenda no se va de la
   * pantalla.
   */
  if (day.compact) {
    return (
      <section className="surface-raised surface-live overflow-hidden rounded-card">
        <h2 className="flex items-baseline justify-between gap-3 border-b border-border-subtle px-4 py-3">
          <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-live">
            {DASHBOARD_COPY.current.inProgress}
          </span>
          <span className="font-numeric text-sm tabular-nums text-ink-secondary">
            {DASHBOARD_COPY.current.count(day.inProgress.length)}
          </span>
        </h2>
        {day.inProgress.map((appointment) => (
          <DashboardCurrentAppointmentCompact
            key={appointment.id}
            appointment={appointment}
            timezone={timezone}
            overdueMinutes={
              appointment.overdue ? appointment.overdueMinutes : 0
            }
            completing={completingId === appointment.id}
            onComplete={() => onComplete(appointment.id)}
          />
        ))}
      </section>
    );
  }

  /*
   * Pocas: envuelve en lugar de usar columnas fijas. Con una sola, la tarjeta
   * ocupa el ancho completo —que es lo que la hace protagonista— y con dos o
   * tres se reparten solas sin que haya que contar.
   */
  return (
    <div className="flex flex-wrap gap-3">
      {day.inProgress.map((appointment) => (
        <DashboardCurrentAppointmentCard
          key={appointment.id}
          appointment={appointment}
          timezone={timezone}
          upcoming={false}
          overdueMinutes={appointment.overdue ? appointment.overdueMinutes : 0}
          completing={completingId === appointment.id}
          onComplete={() => onComplete(appointment.id)}
        />
      ))}
    </div>
  );
}
