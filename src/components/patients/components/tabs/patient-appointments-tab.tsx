"use client";

import { useRouter } from "next/navigation";
import { useCallback } from "react";

import { notifyAppointmentStatusError } from "@/components/appointments/components/appointment-status-error-toast";
import AppointmentsTable from "@/components/appointments/components/appointments-table";
import { notifySuccess } from "@/lib/sound";
import { useAppointmentsStore } from "@/stores/appointments-store";
import { usePatientsStore } from "@/stores/patients-store";
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
        const appointment = await useAppointmentsStore
          .getState()
          .updateAppointmentStatus(id, status);
        await usePatientsStore
          .getState()
          .fetchPatientAppointments(appointment.patient_id);
        notifySuccess("Estado de la cita actualizado.");
      } catch (cause) {
        notifyAppointmentStatusError(cause);
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
