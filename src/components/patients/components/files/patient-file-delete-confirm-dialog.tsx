"use client";

import { useState } from "react";
import { toast } from "react-toastify";

import AppConfirmDialog from "@/components/ui/app-confirm-dialog";
import { PATIENT_FILES_COPY } from "@/copy/patient-files-copy";
import { useDeletePatientFile } from "@/lib/hooks/use-patient-files";
import type { PatientFile } from "@/types/database.types";

type PatientFileDeleteConfirmDialogProps = {
  patientId: string;
  file: PatientFile;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
};

export default function PatientFileDeleteConfirmDialog({
  patientId,
  file,
  open,
  onOpenChange,
  onSuccess,
}: PatientFileDeleteConfirmDialogProps) {
  const { mutateAsync, isPending } = useDeletePatientFile();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleConfirm = async () => {
    setErrorMessage(null);

    try {
      await mutateAsync({ patientId, file });
      toast.success(PATIENT_FILES_COPY.delete.success);
      handleOpenChange(false);
      onSuccess();
    } catch (cause) {
      setErrorMessage(
        cause instanceof Error
          ? cause.message
          : PATIENT_FILES_COPY.delete.error,
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
      title={PATIENT_FILES_COPY.delete.title}
      description={PATIENT_FILES_COPY.delete.description(
        file.original_filename,
      )}
      confirmLabel={PATIENT_FILES_COPY.delete.confirm}
      cancelLabel={PATIENT_FILES_COPY.delete.cancel}
      pendingLabel={PATIENT_FILES_COPY.delete.pending}
      isPending={isPending}
      onConfirm={handleConfirm}
      confirmTone="danger"
      errorMessage={errorMessage ?? undefined}
    />
  );
}
