"use client";

import { Calendar } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import AppointmentCreateDialog from "@/components/appointments/components/appointment-create-dialog";
import AppointmentRow from "@/components/appointments/components/appointment-row";
import { ActionButton } from "@/components/ui/primitives/action-button";
import { MobileFab } from "@/components/ui/primitives/mobile-fab";
import { Notice } from "@/components/ui/primitives/notice";
import { SkeletonList } from "@/components/ui/primitives/skeleton-list";
import { Stat } from "@/components/ui/primitives/stat";
import { toAgendaAppointments } from "@/lib/calendar-agenda";
import { formatFullDayLabel } from "@/lib/calendar-grid";
import { useAuth } from "@/lib/hooks/use-auth";
import { useDashboard } from "@/lib/hooks/use-dashboard";

export default function DashboardPageClient() {
  const { profile } = useAuth();
  const { data, isLoading, error } = useDashboard();
  const [dialogOpen, setDialogOpen] = useState(false);
  const appointments = data?.appointments ?? [];
  const agendaAppointments = toAgendaAppointments(appointments);
  const confirmedCount = appointments.filter(
    (appointment) => appointment.status === "confirmed",
  ).length;
  const today = new Date();

  const firstName = profile?.full_name?.split(" ")[0] ?? "de nuevo";

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="shrink-0 hidden lg:flex items-center justify-between border-b border-border-subtle bg-canvas px-4 py-3 lg:px-8 lg:py-4">
        <h1 className="text-2xl font-medium text-ink">Dashboard</h1>
        <ActionButton title="Nueva cita" onClick={() => setDialogOpen(true)} />
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto">
        <div className="space-y-6 p-4 lg:p-8">
          <header className="space-y-5 lg:space-y-0">
            <div className="flex items-start justify-between gap-4">
              <div className="flex min-w-0 flex-1 flex-col gap-4 lg:flex-row lg:items-end lg:gap-8">
                <div className="min-w-0">
                  <h1 className="text-3xl font-semibold tracking-tight text-ink lg:text-4xl">
                    Bienvenida, {firstName}
                  </h1>
                  <p className="mt-2 flex items-center gap-2 text-sm text-ink-secondary">
                    <Calendar
                      className="size-4 shrink-0 text-primary"
                      aria-hidden="true"
                    />
                    {formatFullDayLabel(today)}
                  </p>
                </div>
                <div className="hidden shrink-0 items-center divide-x divide-border-subtle lg:flex">
                  <Stat value={String(appointments.length)} label="Citas hoy" />
                  <Stat value={String(confirmedCount)} label="Confirmadas" />
                </div>
              </div>
            </div>
            <div className="border-b border-border-subtle lg:hidden" />
            <div className="grid grid-cols-2 divide-x divide-border-subtle lg:hidden">
              <Stat value={String(appointments.length)} label="Citas hoy" />
              <Stat value={String(confirmedCount)} label="Confirmadas" />
            </div>
          </header>
          <div className="grid gap-6 xl:grid-cols-[1.8fr_1fr]">
            <section className="space-y-4">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <h2 className="text-lg font-medium">Próximas citas</h2>
                <Link
                  href="/calendar"
                  className="text-xs uppercase tracking-wide text-ink-secondary"
                >
                  Ver calendario
                </Link>
              </div>
              <div className="divide-y divide-border-subtle">
                {agendaAppointments.map((appointment) => (
                  <AppointmentRow
                    key={appointment.id}
                    appointment={appointment}
                  />
                ))}
              </div>
              {!isLoading && appointments.length === 0 ? (
                <p className="py-4 text-ink-secondary">
                  No hay citas programadas para hoy.
                </p>
              ) : null}
              {isLoading ? <SkeletonList count={3} /> : null}
              {error ? (
                <Notice
                  tone="danger"
                  message="No se pudo cargar el dashboard."
                />
              ) : null}
            </section>
            <div className="space-y-6">
              <section className="space-y-3">
                <h2 className="text-lg font-medium">Actividad reciente</h2>
                <div className="divide-y divide-border-subtle border-t border-border">
                  {appointments.slice(0, 3).map((appointment) => (
                    <div key={appointment.id} className="py-3">
                      <p className="font-medium text-ink">
                        Cita {appointment.status ?? "programada"} -{" "}
                        {appointment.patients?.full_name ?? "Paciente"}
                      </p>
                      <p className="text-sm text-ink-secondary">Hoy</p>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
      <AppointmentCreateDialog open={dialogOpen} onOpenChange={setDialogOpen} />
      <MobileFab label="Nueva cita" onClick={() => setDialogOpen(true)} />
    </div>
  );
}
