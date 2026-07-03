"use client";

import { toast } from "react-toastify";

import { TREATMENTS_COPY } from "@/components/treatments/treatments-copy";
import AppConfirmDialog from "@/components/ui/app-confirm-dialog";
import { useDeleteTreatment } from "@/lib/hooks/use-treatment";
import type { Treatment } from "@/types/database.types";

type TreatmentDeleteConfirmDialogProps = {
  treatment: Treatment;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
};

export default function TreatmentDeleteConfirmDialog({
  treatment,
  open,
  onOpenChange,
  onSuccess,
}: TreatmentDeleteConfirmDialogProps) {
  const { mutate, isPending } = useDeleteTreatment();

  const handleConfirm = () => {
    mutate(treatment.id, {
      onSuccess: () => {
        toast.success(TREATMENTS_COPY.delete.success);
        onOpenChange(false);
        onSuccess();
      },
      onError: (cause) => {
        toast.error(cause.message);
      },
    });
  };

  return (
    <AppConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      title={TREATMENTS_COPY.delete.title}
      description={TREATMENTS_COPY.delete.description(treatment.name)}
      confirmLabel={TREATMENTS_COPY.delete.confirm}
      cancelLabel={TREATMENTS_COPY.delete.cancel}
      pendingLabel={TREATMENTS_COPY.delete.pending}
      isPending={isPending}
      onConfirm={handleConfirm}
      confirmTone="danger"
    />
  );
}
