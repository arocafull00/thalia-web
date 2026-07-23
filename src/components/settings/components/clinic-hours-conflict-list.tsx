"use client";

import { CalendarX } from "lucide-react";

import { CLINIC_HOURS_COPY } from "@/copy/clinic-hours-copy";
import type { FutureAppointmentConflict } from "@/dal/appointments.dal";

type Props = {
  conflicts: FutureAppointmentConflict[];
};

function formatDate(startsAt: string): string {
  return new Intl.DateTimeFormat("es-ES", {
    weekday: "short",
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(startsAt));
}

function resolveName(
  field: { full_name: string } | { full_name: string }[] | null,
  fallback: string,
): string {
  if (!field) return fallback;
  const name = Array.isArray(field) ? field[0]?.full_name : field.full_name;
  return name ?? fallback;
}

export default function ClinicHoursConflictList({ conflicts }: Props) {
  return (
    <div className="space-y-3">
      <p className="text-sm text-ink-secondary">
        {CLINIC_HOURS_COPY.conflicts.description}
      </p>
      <ul className="divide-y divide-border-subtle rounded-xl border border-border">
        {conflicts.map((appt) => (
          <li key={appt.id} className="flex items-start gap-3 px-4 py-3">
            <CalendarX className="mt-0.5 size-4 shrink-0 text-danger" />
            <div className="min-w-0">
              <p className="text-sm font-medium text-ink">
                {resolveName(
                  appt.patients,
                  CLINIC_HOURS_COPY.conflicts.noPatient,
                )}
              </p>
              <p className="text-xs text-ink-muted">
                {formatDate(appt.starts_at)}
                {" · "}
                {resolveName(
                  appt.employees,
                  CLINIC_HOURS_COPY.conflicts.noEmployee,
                )}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
