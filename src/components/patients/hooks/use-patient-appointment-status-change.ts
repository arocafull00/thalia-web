"use client";

import { useCallback } from "react";

import { notifyAppointmentStatusError } from "@/components/appointments/components/appointment-status-error-toast";
import { notifySuccess } from "@/lib/sound";
import { useAppointmentsStore } from "@/stores/appointments-store";
import { usePatientsStore } from "@/stores/patients-store";
import type { AppointmentStatus } from "@/types/database.types";

export function usePatientAppointmentStatusChange(patientId: string) {
  return useCallback(
    async (id: string, status: AppointmentStatus) => {
      try {
        await useAppointmentsStore.getState().updateAppointmentStatus(id, status);
        await usePatientsStore.getState().fetchPatientAppointments(patientId);
        notifySuccess("Estado de la cita actualizado.");
      } catch (cause) {
        notifyAppointmentStatusError(cause);
      }
    },
    [patientId],
  );
}
