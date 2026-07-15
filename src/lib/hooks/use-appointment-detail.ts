import { useCallback, useState } from "react";
import { toast } from "react-toastify";

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

  const openEditDialog = useCallback(() => {
    setDialogOpen(true);
  }, []);

  const closeDialog = useCallback(() => {
    setDialogOpen(false);
  }, []);

  const openCancelConfirm = useCallback(() => {
    setCancelConfirmOpen(true);
  }, []);

  const closeCancelConfirm = useCallback(() => {
    setCancelConfirmOpen(false);
  }, []);

  const handleStatusChange = useCallback(
    async (status: AppointmentStatus) => {
      if (!appointment) {
        return;
      }

      try {
        await useAppointmentsStore
          .getState()
          .updateAppointmentStatus(appointment.id, status);
        notifySuccess(APPOINTMENT_DETAIL_COPY.statusSuccess);
      } catch (cause) {
        toast.error(
          cause instanceof Error
            ? cause.message
            : APPOINTMENT_DETAIL_COPY.statusError,
        );
      }
    },
    [appointment],
  );

  const confirmCancel = useCallback(async () => {
    await handleStatusChange("cancelled");
    setCancelConfirmOpen(false);
  }, [handleStatusChange]);

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
