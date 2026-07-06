"use client";

import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { toast } from "react-toastify";

import AppointmentCreateDialog from "@/components/appointments/components/appointment-create-dialog";
import AppointmentsTable from "@/components/appointments/components/appointments-table";
import { ActionButton } from "@/components/ui/primitives/action-button";
import { Notice } from "@/components/ui/primitives/notice";
import { PageHeader } from "@/components/ui/primitives/page-header";
import { SkeletonList } from "@/components/ui/primitives/skeleton-list";
import { useAppointmentsPage } from "@/lib/hooks/use-appointments-page";
import { useAppointmentsStore } from "@/stores/appointments-store";
import { useTopbarSearchStore } from "@/stores/topbar-search-store";
import type { AppointmentStatus } from "@/types/database.types";

export default function AppointmentsPageClient() {
  const router = useRouter();
  const [dialogOpen, setDialogOpen] = useState(false);
  const topbarQuery = useTopbarSearchStore((state) => state.query);
  const { appointments, flatAppointments, showEmptyState } =
    useAppointmentsPage(topbarQuery);

  const handleStatusChange = useCallback(
    async (id: string, status: AppointmentStatus) => {
      try {
        await useAppointmentsStore
          .getState()
          .updateAppointmentStatus(id, status);
        toast.success("Estado de la cita actualizado.");
      } catch {
        toast.error("No se pudo actualizar el estado de la cita.");
      }
    },
    [],
  );

  return (
    <div className="space-y-6 p-8">
      <div className="flex items-start justify-between gap-4">
        <PageHeader subtitle="Proximas dos semanas" title="Citas" />
        <ActionButton title="Nueva cita" onClick={() => setDialogOpen(true)} />
      </div>
      {appointments.isLoading ? <SkeletonList /> : null}
      {appointments.error ? (
        <Notice tone="danger" message="No se pudieron cargar las citas." />
      ) : null}
      {showEmptyState ? (
        <div className="rounded-2xl border border-dashed border-border p-10 text-center text-ink-secondary">
          No hay citas programadas.
        </div>
      ) : null}
      {!showEmptyState && !appointments.isLoading ? (
        <AppointmentsTable
          appointments={flatAppointments}
          onRowClick={(id) => router.push(`/appointments/${id}`)}
          onStatusChange={handleStatusChange}
        />
      ) : null}
      <AppointmentCreateDialog open={dialogOpen} onOpenChange={setDialogOpen} />
    </div>
  );
}
