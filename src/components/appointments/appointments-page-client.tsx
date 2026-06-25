"use client";

import { useRouter } from "next/navigation";
import { format } from "date-fns";

import { ActionButton, Notice, PageHeader, SkeletonList } from "@/components/ui/primitives";
import { appointmentStatusLabel, formatDateTime, formatTime } from "@/lib/format";
import { useAppointmentsPage } from "@/lib/hooks/use-appointments-page";
import { useTopbarSearchStore } from "@/stores/topbar-search-store";

export default function AppointmentsPageClient() {
  const router = useRouter();
  const topbarQuery = useTopbarSearchStore((state) => state.query);
  const { appointments, flatAppointments, showEmptyState } = useAppointmentsPage(topbarQuery);

  return (
    <div className="space-y-6 p-8">
      <div className="flex items-start justify-between gap-4">
        <PageHeader subtitle="Proximas dos semanas" title="Citas" />
        <ActionButton title="Nueva cita" onClick={() => router.push("/appointments/new")} />
      </div>
      {appointments.isLoading ? <SkeletonList /> : null}
      {appointments.error ? <Notice tone="danger" message="No se pudieron cargar las citas." /> : null}
      {showEmptyState ? (
        <div className="rounded-2xl border border-dashed border-border p-10 text-center text-ink-secondary">
          No hay citas programadas.
        </div>
      ) : null}
      {!showEmptyState && !appointments.isLoading ? (
        <div className="overflow-hidden rounded-2xl border border-border bg-surface">
          <div className="grid grid-cols-[1fr_0.7fr_1.2fr_1.4fr_0.9fr] gap-4 border-b border-border px-4 py-2 text-xs uppercase tracking-wide text-ink-muted">
            <span>Fecha</span>
            <span>Hora</span>
            <span>Paciente</span>
            <span>Servicio</span>
            <span>Estado</span>
          </div>
          {flatAppointments.map((appointment) => {
            const startsAt = new Date(appointment.starts_at);
            const treatment =
              appointment.appointment_treatments[0]?.treatment_types?.name ?? "Sin tratamiento";

            return (
              <button
                key={appointment.id}
                type="button"
                onClick={() => router.push(`/appointments/${appointment.id}`)}
                className="grid w-full grid-cols-[1fr_0.7fr_1.2fr_1.4fr_0.9fr] gap-4 border-b border-border-subtle px-4 py-4 text-left transition hover:bg-canvas"
              >
                <span className="text-sm text-ink-secondary">
                  {formatDateTime(appointment.starts_at).split(",")[0] ?? format(startsAt, "dd/MM/yyyy")}
                </span>
                <span className="font-medium tabular-nums text-ink">{formatTime(startsAt)}</span>
                <span className="truncate font-medium text-ink">{appointment.patients?.full_name ?? "Paciente"}</span>
                <span className="truncate text-sm text-ink-secondary">{treatment}</span>
                <span className="text-xs uppercase tracking-wide text-ink-secondary">
                  {appointmentStatusLabel(appointment.status)}
                </span>
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
