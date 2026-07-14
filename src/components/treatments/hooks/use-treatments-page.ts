import { useCallback, useState } from "react";

export function useTreatmentsPage() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedTreatmentId, setSelectedTreatmentId] = useState<string | null>(
    null,
  );

  const openCreateDialog = useCallback(() => {
    setSelectedTreatmentId(null);
    setDialogOpen(true);
  }, []);

  const closeDialog = useCallback(() => {
    setDialogOpen(false);
    setSelectedTreatmentId(null);
  }, []);

  return {
    dialogOpen,
    selectedTreatmentId,
    openCreateDialog,
    closeDialog,
  };
}
