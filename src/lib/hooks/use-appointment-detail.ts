import { useCallback, useState } from "react";
import { toast } from "react-toastify";

import { notifyAppointmentStatusError } from "@/components/appointments/components/appointment-status-error-toast";
import { APPOINTMENT_DETAIL_COPY } from "@/copy/appointment-detail-copy";
import { useAppointment } from "@/lib/hooks/use-appointments";
import { notifySuccess } from "@/lib/sound";
import { useAppointmentsStore } from "@/stores/appointments-store";
import type {
  AppointmentStatus,
  AppointmentWithRelations,
} from "@/types/database.types";

export function useAppointmentDetail(
  appointmentOrId: AppointmentWithRelations | string,
) {
  const {
    data: appointment,
    isLoading,
    error,
  } = useAppointment(appointmentOrId);
  const updatingStatus = useAppointmentsStore((state) => state.updatingStatus);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [cancelConfirmOpen, setCancelConfirmOpen] = useState(false);
  const [cancelError, setCancelError] = useState<string | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [restoreStock, setRestoreStock] = useState(false);
  const [deleted, setDeleted] = useState(false);
  const deleting = useAppointmentsStore((state) => state.deleting);

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

  const openDeleteConfirm = useCallback(() => {
    setDeleteError(null);
    setRestoreStock(false);
    setDeleteConfirmOpen(true);
  }, []);

  const closeDeleteConfirm = useCallback(() => {
    setDeleteError(null);
    setDeleteConfirmOpen(false);
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

  const confirmDelete = useCallback(async () => {
    if (!appointment) {
      return;
    }

    setDeleteError(null);

    try {
      await useAppointmentsStore
        .getState()
        .deleteAppointment(appointment.id, restoreStock);
      notifySuccess(APPOINTMENT_DETAIL_COPY.deleteSuccess);
      setDeleteConfirmOpen(false);
      setDeleted(true);
    } catch {
      setDeleteError(APPOINTMENT_DETAIL_COPY.deleteError);
      toast.error(APPOINTMENT_DETAIL_COPY.deleteError);
    }
  }, [appointment, restoreStock]);

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
    deleteConfirmOpen,
    deleteError,
    restoreStock,
    deleted,
    deleting,
    updatingStatus,
    canChangeStatus,
    openEditDialog,
    closeDialog,
    openCancelConfirm,
    closeCancelConfirm,
    openDeleteConfirm,
    closeDeleteConfirm,
    setRestoreStock,
    handleStatusChange,
    confirmCancel,
    confirmDelete,
  };
}
