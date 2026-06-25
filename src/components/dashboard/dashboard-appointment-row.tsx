"use client";

import Link from "next/link";

import { formatAppointmentDuration, formatTime } from "@/lib/format";
import type { AppointmentWithRelations } from "@/types/database.types";

type DashboardAppointmentRowProps = {
  appointment: AppointmentWithRelations;
};

export default function DashboardAppointmentRow({ appointment }: DashboardAppointmentRowProps) {
  const treatment =
    appointment.appointment_treatments[0]?.treatment_types?.name ?? "Sin tratamiento";
  const startsAt = new Date(appointment.starts_at);
  const status = appointment.status ?? "scheduled";
  const employeeColor = appointment.employees?.color ?? null;
  const isMuted = status === "cancelled" || status === "no_show";

  return (
    <Link
      href={`/appointments/${appointment.id}`}
      className={`flex items-center gap-4 rounded-2xl border border-border bg-surface p-4 shadow-sm transition hover:bg-canvas ${isMuted ? "opacity-50" : ""}`}
    >
      <div className="w-14 shrink-0">
        <p className="text-lg font-medium tabular-nums text-ink">{formatTime(startsAt)}</p>
        <p className="text-xs text-ink-muted">{formatAppointmentDuration(appointment)}</p>
      </div>
      <div
        className={`w-1 self-stretch rounded-full ${employeeColor ? "" : "bg-border"}`}
        style={employeeColor ? { backgroundColor: employeeColor } : undefined}
      />
      <div className="min-w-0 flex-1">
        <p className="truncate text-lg font-medium text-ink">
          {appointment.patients?.full_name ?? "Paciente sin nombre"}
        </p>
        <p className="truncate text-sm text-ink-secondary">{treatment}</p>
        {appointment.employees?.full_name ? (
          <p className="truncate text-xs text-ink-muted">{appointment.employees.full_name}</p>
        ) : null}
      </div>
      <span className="rounded-full bg-primary-subtle/40 px-3 py-1 text-[11px] uppercase tracking-wide text-ink-secondary">
        {status}
      </span>
    </Link>
  );
}
