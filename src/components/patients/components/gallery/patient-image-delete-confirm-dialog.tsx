"use client";

import { useState } from "react";

import AppConfirmDialog from "@/components/ui/app-confirm-dialog";
import { PATIENT_GALLERY_COPY } from "@/copy/patient-gallery-copy";
import { useDeletePatientImage } from "@/lib/hooks/use-patient-images";
import { notifySuccess } from "@/lib/sound";
import type { PatientImage } from "@/types/database.types";

type PatientImageDeleteConfirmDialogProps = {
  patientId: string;
  image: PatientImage;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
};

export default function PatientImageDeleteConfirmDialog({
  patientId,
  image,
  open,
  onOpenChange,
  onSuccess,
}: PatientImageDeleteConfirmDialogProps) {
  const { mutateAsync, isPending } = useDeletePatientImage();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleConfirm = async () => {
    setErrorMessage(null);

    try {
      await mutateAsync({ patientId, image });
      notifySuccess(PATIENT_GALLERY_COPY.delete.success);
      handleOpenChange(false);
      onSuccess();
    } catch (cause) {
      setErrorMessage(
        cause instanceof Error
          ? cause.message
          : PATIENT_GALLERY_COPY.delete.error,
      );
    }
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
      title={PATIENT_GALLERY_COPY.delete.title}
      description={PATIENT_GALLERY_COPY.delete.description}
      confirmLabel={PATIENT_GALLERY_COPY.delete.confirm}
      cancelLabel={PATIENT_GALLERY_COPY.delete.cancel}
      pendingLabel={PATIENT_GALLERY_COPY.delete.pending}
      isPending={isPending}
      onConfirm={handleConfirm}
      confirmTone="danger"
      errorMessage={errorMessage ?? undefined}
    />
  );
}
