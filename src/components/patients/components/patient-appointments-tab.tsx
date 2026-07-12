"use client";

import { useRouter } from "next/navigation";
import { useCallback } from "react";
import { toast } from "react-toastify";

import AppointmentsTable from "@/components/appointments/components/appointments-table";
import { useAppointmentsStore } from "@/stores/appointments-store";
import type {
  AppointmentStatus,
  AppointmentWithRelations,
} from "@/types/database.types";

type PatientAppointmentsTabProps = {
  appointments: AppointmentWithRelations[];
};

export default function PatientAppointmentsTab({
  appointments,
}: PatientAppointmentsTabProps) {
  const router = useRouter();

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
    <div className="space-y-4">
      <AppointmentsTable
        appointments={appointments}
        onRowClick={(id) => router.push(`/appointments/${id}`)}
        onStatusChange={handleStatusChange}
      />
    </div>
  );
}
