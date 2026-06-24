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
  const employeeColor = appointment.employees?.color ?? "#d4d4d8";
  const isMuted = status === "cancelled" || status === "no_show";

  return (
    <Link
      href={`/appointments/${appointment.id}`}
      className={`flex items-center gap-4 rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm transition hover:bg-zinc-50 ${isMuted ? "opacity-50" : ""}`}
    >
      <div className="w-14 shrink-0">
        <p className="text-lg font-medium tabular-nums text-zinc-900">{formatTime(startsAt)}</p>
        <p className="text-xs text-zinc-400">{formatAppointmentDuration(appointment)}</p>
      </div>
      <div className="w-1 self-stretch rounded-full" style={{ backgroundColor: employeeColor }} />
      <div className="min-w-0 flex-1">
        <p className="truncate text-lg font-medium text-zinc-900">
          {appointment.patients?.full_name ?? "Paciente sin nombre"}
        </p>
        <p className="truncate text-sm text-zinc-500">{treatment}</p>
        {appointment.employees?.full_name ? (
          <p className="truncate text-xs text-zinc-400">{appointment.employees.full_name}</p>
        ) : null}
      </div>
      <span className="rounded-full bg-zinc-100 px-3 py-1 text-[11px] uppercase tracking-wide text-zinc-600">
        {status}
      </span>
    </Link>
  );
}
