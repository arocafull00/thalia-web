"use client";

import { useState } from "react";

import AppDialog from "@/components/ui/app-dialog";
import AppDialogDescription from "@/components/ui/app-dialog-description";
import AppDialogFooter from "@/components/ui/app-dialog-footer";
import AppDialogHeader from "@/components/ui/app-dialog-header";
import AppDialogTitle from "@/components/ui/app-dialog-title";
import AppSheetContent from "@/components/ui/app-sheet-content";
import { Button } from "@/components/ui/button";
import {
  FORM_ACTION_ICONS,
  FORM_ACTION_ICON_CLASS,
} from "@/components/ui/primitives/form-action-icons";
import { PATIENT_GALLERY_COPY } from "@/copy/patient-gallery-copy";
import { usePatientImageUploader } from "@/lib/hooks/use-patient-image-uploader";

import PatientImageUploaderForm from "./patient-image-uploader-form";

type PatientImageUploaderDialogProps = {
  patientId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export default function PatientImageUploaderDialog({
  patientId,
  open,
  onOpenChange,
}: PatientImageUploaderDialogProps) {
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
  } = usePatientImageUploader(patientId, () => onOpenChange(false));

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
            <AppDialogTitle>
              {PATIENT_GALLERY_COPY.uploader.title}
            </AppDialogTitle>
            <AppDialogDescription>
              {PATIENT_GALLERY_COPY.uploader.description}
            </AppDialogDescription>
          </AppDialogHeader>

          <div className="min-h-0 flex-1 overflow-y-auto px-1">
            <PatientImageUploaderForm
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
                  {PATIENT_GALLERY_COPY.uploader.progress(
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
              <FORM_ACTION_ICONS.cancel
                className={FORM_ACTION_ICON_CLASS}
                aria-hidden="true"
              />
              {PATIENT_GALLERY_COPY.delete.cancel}
            </Button>
            <Button
              type="submit"
              disabled={isPending}
              data-testid="patient-gallery-upload-submit"
            >
              <FORM_ACTION_ICONS.upload
                className={FORM_ACTION_ICON_CLASS}
                aria-hidden="true"
              />
              {isPending
                ? PATIENT_GALLERY_COPY.uploader.pending
                : PATIENT_GALLERY_COPY.uploader.submit}
            </Button>
          </AppDialogFooter>
        </form>
      </AppSheetContent>
    </AppDialog>
  );
}
