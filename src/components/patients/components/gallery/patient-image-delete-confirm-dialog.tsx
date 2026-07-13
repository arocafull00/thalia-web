"use client";

import { toast } from "react-toastify";

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

  const handleConfirm = async () => {
    try {
      await mutateAsync({ patientId, image });
      notifySuccess(PATIENT_GALLERY_COPY.delete.success);
      onOpenChange(false);
      onSuccess();
    } catch (cause) {
      toast.error(
        cause instanceof Error
          ? cause.message
          : PATIENT_GALLERY_COPY.delete.error,
      );
    }
  };

  return (
    <AppConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      title={PATIENT_GALLERY_COPY.delete.title}
      description={PATIENT_GALLERY_COPY.delete.description}
      confirmLabel={PATIENT_GALLERY_COPY.delete.confirm}
      cancelLabel={PATIENT_GALLERY_COPY.delete.cancel}
      pendingLabel={PATIENT_GALLERY_COPY.delete.pending}
      isPending={isPending}
      onConfirm={handleConfirm}
      confirmTone="danger"
    />
  );
}
