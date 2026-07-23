"use client";

import { useState } from "react";

import AppDialog from "@/components/ui/app-dialog";
import AppDialogDescription from "@/components/ui/app-dialog-description";
import AppDialogFooter from "@/components/ui/app-dialog-footer";
import AppDialogHeader from "@/components/ui/app-dialog-header";
import AppDialogTitle from "@/components/ui/app-dialog-title";
import AppSheetContent from "@/components/ui/app-sheet-content";
import { Button } from "@/components/ui/button";
import { PATIENT_FILES_COPY } from "@/copy/patient-files-copy";
import { usePatientFileUploader } from "@/lib/hooks/use-patient-file-uploader";

import PatientFileUploaderForm from "./patient-file-uploader-form";

type PatientFileUploaderDialogProps = {
  patientId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export default function PatientFileUploaderDialog({
  patientId,
  open,
  onOpenChange,
}: PatientFileUploaderDialogProps) {
  const [formKey, setFormKey] = useState(0);
  const {
    register,
    control,
    errors,
    onSubmit,
    isPending,
    progress,
    currentFile,
    totalFiles,
    setFiles,
    resetForm,
  } = usePatientFileUploader(patientId, () => onOpenChange(false));

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) {
      resetForm();
      setFormKey((key) => key + 1);
    }

    onOpenChange(nextOpen);
  };

  return (
    <AppDialog open={open} onOpenChange={handleOpenChange}>
      <AppSheetContent>
        <form onSubmit={onSubmit} className="flex min-h-0 flex-1 flex-col">
          <AppDialogHeader>
            <AppDialogTitle>{PATIENT_FILES_COPY.uploader.title}</AppDialogTitle>
            <AppDialogDescription>
              {PATIENT_FILES_COPY.uploader.description}
            </AppDialogDescription>
          </AppDialogHeader>

          <div className="min-h-0 flex-1 overflow-y-auto px-1">
            <PatientFileUploaderForm
              key={formKey}
              register={register}
              control={control}
              errors={errors}
              onFilesChanged={setFiles}
            />

            {isPending ? (
              <div className="mt-4 space-y-2">
                <div className="h-2 overflow-hidden rounded-full bg-canvas">
                  <div
                    className="h-full bg-primary transition-[width]"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <p className="text-sm text-ink-secondary">
                  {PATIENT_FILES_COPY.uploader.progress(
                    currentFile,
                    totalFiles,
                  )}
                </p>
              </div>
            ) : null}
          </div>

          <AppDialogFooter errorMessage={errors.root?.message}>
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
              disabled={isPending}
              className="rounded-button px-3 py-1.5 text-sm"
            >
              {PATIENT_FILES_COPY.delete.cancel}
            </Button>
            <Button
              type="submit"
              disabled={isPending}
              data-testid="patient-file-upload-submit"
            >
              {isPending
                ? PATIENT_FILES_COPY.uploader.pending
                : PATIENT_FILES_COPY.uploader.submit}
            </Button>
          </AppDialogFooter>
        </form>
      </AppSheetContent>
    </AppDialog>
  );
}
