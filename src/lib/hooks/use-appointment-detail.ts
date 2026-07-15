import { useCallback, useState } from "react";

import { notifyAppointmentStatusError } from "@/components/appointments/components/appointment-status-error-toast";
import { APPOINTMENT_DETAIL_COPY } from "@/copy/appointment-detail-copy";
import { useAppointment } from "@/lib/hooks/use-appointments";
import { notifySuccess } from "@/lib/sound";
import { useAppointmentsStore } from "@/stores/appointments-store";
import type { AppointmentStatus } from "@/types/database.types";

export function useAppointmentDetail(appointmentId: string) {
  const { data: appointment, isLoading, error } = useAppointment(appointmentId);
  const updatingStatus = useAppointmentsStore((state) => state.updatingStatus);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [cancelConfirmOpen, setCancelConfirmOpen] = useState(false);
  const [cancelError, setCancelError] = useState<string | null>(null);

  const openEditDialog = useCallback(() => {
    setDialogOpen(true);
  }, []);

  const closeDialog = useCallback(() => {
    setDialogOpen(false);
  }, []);

  const openCancelConfirm = useCallback(() => {
    setCancelError(null);
    setCancelConfirmOpen(true);
  }, []);

  const closeCancelConfirm = useCallback(() => {
    setCancelError(null);
    setCancelConfirmOpen(false);
  }, []);

  const updateStatus = useCallback(
    async (status: AppointmentStatus) => {
      if (!appointment) {
        return false;
      }

      await useAppointmentsStore
        .getState()
        .updateAppointmentStatus(appointment.id, status);
      notifySuccess(APPOINTMENT_DETAIL_COPY.statusSuccess);

      return true;
    },
    [appointment],
  );

  const handleStatusChange = useCallback(
    async (status: AppointmentStatus) => {
      try {
        await updateStatus(status);
      } catch (cause) {
        notifyAppointmentStatusError(cause);
      }
    },
    [updateStatus],
  );

  const confirmCancel = useCallback(async () => {
    setCancelError(null);

    try {
      const updated = await updateStatus("cancelled");

      if (updated) {
        setCancelConfirmOpen(false);
      }
    } catch (cause) {
      setCancelError(
        cause instanceof Error
          ? cause.message
          : APPOINTMENT_DETAIL_COPY.statusError,
      );
    }
  }, [updateStatus]);

  const canChangeStatus =
    appointment?.status === "scheduled" ||
    appointment?.status === "confirmed" ||
    appointment?.status === "in_progress";

  return {
    appointment,
    isLoading,
    error,
    dialogOpen,
    cancelConfirmOpen,
    cancelError,
    updatingStatus,
    canChangeStatus,
    openEditDialog,
    closeDialog,
    openCancelConfirm,
    closeCancelConfirm,
    handleStatusChange,
    confirmCancel,
  };
}
