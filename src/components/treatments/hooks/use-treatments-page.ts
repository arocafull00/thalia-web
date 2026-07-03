import { useCallback, useState } from "react";

import type { Treatment } from "@/types/database.types";

export function useTreatmentsPage() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedTreatmentId, setSelectedTreatmentId] = useState<string | null>(
    null,
  );
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [treatmentToDelete, setTreatmentToDelete] = useState<Treatment | null>(
    null,
  );

  const openCreateDialog = useCallback(() => {
    setSelectedTreatmentId(null);
    setDialogOpen(true);
  }, []);

  const openEditDialog = useCallback((treatment: Treatment) => {
    setSelectedTreatmentId(treatment.id);
    setDialogOpen(true);
  }, []);

  const closeDialog = useCallback(() => {
    setDialogOpen(false);
    setSelectedTreatmentId(null);
  }, []);

  const openDeleteDialog = useCallback((treatment: Treatment) => {
    setTreatmentToDelete(treatment);
    setDeleteDialogOpen(true);
  }, []);

  const closeDeleteDialog = useCallback(() => {
    setDeleteDialogOpen(false);
    setTreatmentToDelete(null);
  }, []);

  return {
    dialogOpen,
    selectedTreatmentId,
    deleteDialogOpen,
    treatmentToDelete,
    openCreateDialog,
    openEditDialog,
    closeDialog,
    openDeleteDialog,
    closeDeleteDialog,
  };
}
