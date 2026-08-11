"use client";

import { useCallback, useState } from "react";
import { toast } from "react-toastify";

import { APPOINTMENT_DETAIL_COPY } from "@/copy/appointment-detail-copy";
import { notifySuccess } from "@/lib/sound";
import { useAppointmentsStore } from "@/stores/appointments-store";
import type { AppointmentWithRelations } from "@/types/database.types";

export function useAppointmentListDelete() {
  const [appointment, setAppointment] =
    useState<AppointmentWithRelations | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [restoreStock, setRestoreStock] = useState(false);
  const isPending = useAppointmentsStore((state) => state.deleting);

  const openDialog = useCallback(
    (nextAppointment: AppointmentWithRelations) => {
      setErrorMessage(null);
      setRestoreStock(false);
      setAppointment(nextAppointment);
    },
    [],
  );

  const closeDialog = useCallback(() => {
    setErrorMessage(null);
    setAppointment(null);
  }, []);

  const confirmDelete = useCallback(async () => {
    if (!appointment) {
      return;
    }

    setErrorMessage(null);

    try {
      await useAppointmentsStore
        .getState()
        .deleteAppointment(appointment.id, restoreStock);
      notifySuccess(APPOINTMENT_DETAIL_COPY.deleteSuccess);
      setAppointment(null);
    } catch {
      setErrorMessage(APPOINTMENT_DETAIL_COPY.deleteError);
      toast.error(APPOINTMENT_DETAIL_COPY.deleteError);
    }
  }, [appointment, restoreStock]);

  return {
    appointment,
    canRestoreStock: appointment?.status === "completed",
    closeDialog,
    confirmDelete,
    errorMessage,
    isPending,
    openDialog,
    restoreStock,
    setRestoreStock,
  };
}
