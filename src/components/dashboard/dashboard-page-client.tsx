"use client";

import Link from "next/link";
import { useCallback, useState } from "react";

import AppointmentCreateDialog from "@/components/appointments/components/appointment-create-dialog";
import DashboardAppointmentRow from "@/components/dashboard/dashboard-appointment-row";
import { ActionButton } from "@/components/ui/primitives/action-button";
import { Notice } from "@/components/ui/primitives/notice";
import { SkeletonList } from "@/components/ui/primitives/skeleton-list";
import { formatCurrency } from "@/lib/format";
import { useAuth } from "@/lib/hooks/use-auth";
import { useDashboard } from "@/lib/hooks/use-dashboard";

function formatTodayTitle(date: Date) {
  const weekday = new Intl.DateTimeFormat("es-ES", { weekday: "long" }).format(
    date,
  );
  const dayMonth = new Intl.DateTimeFormat("es-ES", {
    day: "numeric",
    month: "long",
  }).format(date);
  return `Hoy, ${weekday} ${dayMonth}`;
}

export default function DashboardPageClient() {
  const { profile } = useAuth();
  const { data, isLoading, error, refresh } = useDashboard();
  const [refreshing, setRefreshing] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const appointments = data?.appointments ?? [];
  const lowStock = data?.lowStock ?? [];
  const confirmedCount = appointments.filter(
    (appointment) => appointment.status === "confirmed",
  ).length;
  const today = new Date();

  const onRefresh = useCallback(async () => {
    setRefreshing(true);

    try {
      await refresh();
    } finally {
      setRefreshing(false);
    }
  }, [refresh]);

  const firstName = profile?.full_name?.split(" ")[0] ?? "de nuevo";
  const metrics = [
    { label: "Neto semanal", value: formatCurrency(data?.weeklyNet ?? 0) },
    { label: "Citas hoy", value: String(appointments.length) },
    { label: "Confirmadas", value: String(confirmedCount) },
    {
      label: "Inventario critico",
      value: String(lowStock.length),
      highlight: true,
    },
  ];

  return (
    <div className="space-y-6 p-8">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-4xl font-medium tracking-tight text-ink">
            Bienvenida, {firstName}
          </h1>
          <p className="mt-2 text-ink-secondary">
            {formatTodayTitle(today)}. Tienes {appointments.length}{" "}
            {appointments.length === 1
              ? "cita programada"
              : "citas programadas"}
            .
          </p>
        </div>
        <div className="flex gap-2">
          <ActionButton
            title={refreshing ? "Actualizando..." : "Actualizar"}
            variant="ghost"
            onClick={() => void onRefresh()}
          />
          <ActionButton
            title="Nueva cita"
            onClick={() => setDialogOpen(true)}
          />
        </div>
      </div>
      <AppointmentCreateDialog open={dialogOpen} onOpenChange={setDialogOpen} />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric) => (
          <div
            key={metric.label}
            className={`rounded-3xl border p-5 ${metric.highlight ? "border-primary bg-primary text-on-primary" : "border-border bg-surface"}`}
          >
            <p
              className={`text-xs uppercase tracking-wide ${metric.highlight ? "text-on-primary/70" : "text-ink-muted"}`}
            >
              {metric.label}
            </p>
            <p className="mt-4 text-3xl font-medium tabular-nums">
              {metric.value}
            </p>
          </div>
        ))}
      </div>
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
          <div className="space-y-3">
            {appointments.map((appointment) => (
              <DashboardAppointmentRow
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
            <Notice tone="danger" message="No se pudo cargar el dashboard." />
          ) : null}
        </section>
        <div className="space-y-6">
          <section className="space-y-3">
            <h2 className="text-lg font-medium">Inventario critico</h2>
            <div className="divide-y divide-border-subtle border-t border-border">
              {lowStock.slice(0, 4).map((item) => (
                <Link
                  key={item.id}
                  href={`/inventory/${item.id}`}
                  className="block py-3 hover:opacity-80"
                >
                  <p className="font-medium text-ink">{item.name}</p>
                  <p className="text-sm text-ink-secondary">
                    {Number(item.stock ?? 0)} {item.unit ?? "un."} disponibles
                  </p>
                </Link>
              ))}
              {!isLoading && lowStock.length === 0 ? (
                <p className="py-3 text-ink-secondary">
                  Sin materiales criticos.
                </p>
              ) : null}
            </div>
          </section>
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
  );
}
