import { useCallback, useState } from "react";

import { useTreatment } from "@/lib/hooks/use-treatment";
import { useTreatmentStore } from "@/stores/treatment-store";

export function useTreatmentDetail(treatmentId: string) {
  const { data: treatment, isLoading, error } = useTreatment(treatmentId);
  const fetchTreatment = useTreatmentStore((state) => state.fetchTreatment);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const openEditDialog = useCallback(() => {
    setEditDialogOpen(true);
  }, []);

  const closeEditDialog = useCallback(() => {
    setEditDialogOpen(false);
  }, []);

  const openDeleteDialog = useCallback(() => {
    setDeleteDialogOpen(true);
  }, []);

  const closeDeleteDialog = useCallback(() => {
    setDeleteDialogOpen(false);
  }, []);

  const refetch = useCallback(() => {
    void fetchTreatment(treatmentId);
  }, [fetchTreatment, treatmentId]);

  return {
    treatment,
    isLoading,
    error,
    editDialogOpen,
    deleteDialogOpen,
    openEditDialog,
    closeEditDialog,
    openDeleteDialog,
    closeDeleteDialog,
    refetch,
  };
}
