"use client";

import { useState } from "react";

import { TREATMENTS_COPY } from "@/components/treatments/treatments-copy";
import AppConfirmDialog from "@/components/ui/app-confirm-dialog";
import { useDeleteTreatment } from "@/lib/hooks/use-treatment";
import { notifySuccess } from "@/lib/sound";
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
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleConfirm = () => {
    setErrorMessage(null);

    mutate(treatment.id, {
      onSuccess: () => {
        notifySuccess(TREATMENTS_COPY.delete.success);
        handleOpenChange(false);
        onSuccess();
      },
      onError: (cause) => {
        setErrorMessage(cause.message || TREATMENTS_COPY.dialog.error);
      },
    });
  };

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) {
      setErrorMessage(null);
    }

    onOpenChange(nextOpen);
  };

  return (
    <AppConfirmDialog
      open={open}
      onOpenChange={handleOpenChange}
      title={TREATMENTS_COPY.delete.title}
      description={TREATMENTS_COPY.delete.description(treatment.name)}
      confirmLabel={TREATMENTS_COPY.delete.confirm}
      cancelLabel={TREATMENTS_COPY.delete.cancel}
      pendingLabel={TREATMENTS_COPY.delete.pending}
      isPending={isPending}
      onConfirm={handleConfirm}
      confirmTone="danger"
      errorMessage={errorMessage ?? undefined}
    />
  );
}
