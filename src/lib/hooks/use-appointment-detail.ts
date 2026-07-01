import { useCallback, useState } from "react";

import { useAppointment } from "@/lib/hooks/use-appointments";

export function useAppointmentDetail(appointmentId: string) {
  const { data: appointment, isLoading, error } = useAppointment(appointmentId);
  const [dialogOpen, setDialogOpen] = useState(false);

  const openEditDialog = useCallback(() => {
    setDialogOpen(true);
  }, []);

  const closeDialog = useCallback(() => {
    setDialogOpen(false);
  }, []);

  return {
    appointment,
    isLoading,
    error,
    dialogOpen,
    openEditDialog,
    closeDialog,
  };
}
