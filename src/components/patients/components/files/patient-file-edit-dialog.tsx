"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { type z } from "zod";

import AppDialog from "@/components/ui/app-dialog";
import AppDialogContent from "@/components/ui/app-dialog-content";
import AppDialogDescription from "@/components/ui/app-dialog-description";
import AppDialogFooter from "@/components/ui/app-dialog-footer";
import AppDialogHeader from "@/components/ui/app-dialog-header";
import AppDialogTitle from "@/components/ui/app-dialog-title";
import AppSearchableCombobox from "@/components/ui/app-searchable-combobox";
import { Button } from "@/components/ui/button";
import {
  PATIENT_FILE_CATEGORY_OPTIONS,
  PATIENT_FILES_COPY,
} from "@/copy/patient-files-copy";
import { useUpdatePatientFile } from "@/lib/hooks/use-patient-files";
import { patientFileUpdateSchema } from "@/lib/schemas/patient-file-schema";
import type { PatientFile } from "@/types/database.types";

const patientFileEditFormSchema = patientFileUpdateSchema;

type PatientFileEditFormValues = z.input<typeof patientFileEditFormSchema>;

const inputClassName =
  "w-full rounded-xl border border-border-field bg-surface px-3 py-2.5 text-sm outline-none ring-primary focus:ring-2";

type PatientFileEditDialogProps = {
  patientId: string;
  file: PatientFile | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export default function PatientFileEditDialog({
  patientId,
  file,
  open,
  onOpenChange,
}: PatientFileEditDialogProps) {
  const { mutateAsync, isPending } = useUpdatePatientFile();

  const {
    register,
    control,
    handleSubmit,
    reset,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm<PatientFileEditFormValues>({
    resolver: zodResolver(patientFileEditFormSchema),
    values: file
      ? {
          category: file.category,
          notes: file.notes ?? "",
        }
      : undefined,
  });

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) {
      reset();
    }

    onOpenChange(nextOpen);
  };

  const onSubmit = handleSubmit(async (data) => {
    clearErrors("root");

    if (!file) {
      return;
    }

    const parsed = patientFileUpdateSchema.safeParse(data);

    if (!parsed.success) {
      setError("root", { message: PATIENT_FILES_COPY.edit.error });
      return;
    }

    try {
      await mutateAsync({
        patientId,
        fileId: file.id,
        data: parsed.data,
      });
      toast.success(PATIENT_FILES_COPY.edit.success);
      handleOpenChange(false);
    } catch (cause) {
      setError("root", {
        message:
          cause instanceof Error
            ? cause.message
            : PATIENT_FILES_COPY.edit.error,
      });
    }
  });

  if (!file) {
    return null;
  }

  return (
    <AppDialog open={open} onOpenChange={handleOpenChange}>
      <AppDialogContent>
        <form onSubmit={onSubmit}>
          <AppDialogHeader>
            <AppDialogTitle>{PATIENT_FILES_COPY.edit.title}</AppDialogTitle>
            <AppDialogDescription>
              {PATIENT_FILES_COPY.edit.description}
            </AppDialogDescription>
          </AppDialogHeader>

          <div className="space-y-4 py-4">
            <label className="block space-y-1.5">
              <span className="text-sm text-ink-secondary">
                {PATIENT_FILES_COPY.uploader.fields.category}
              </span>
              <Controller
                control={control}
                name="category"
                render={({ field }) => (
                  <AppSearchableCombobox
                    value={field.value}
                    onValueChange={(value) =>
                      field.onChange(value ?? field.value)
                    }
                    options={PATIENT_FILE_CATEGORY_OPTIONS}
                    placeholder={
                      PATIENT_FILES_COPY.uploader.categoryPlaceholder
                    }
                    searchPlaceholder={
                      PATIENT_FILES_COPY.uploader.fields.category
                    }
                    showSearch={false}
                  />
                )}
              />
              {errors.category ? (
                <span className="text-sm text-danger">
                  {errors.category.message}
                </span>
              ) : null}
            </label>

            <label className="block space-y-1.5">
              <span className="text-sm text-ink-secondary">
                {PATIENT_FILES_COPY.uploader.fields.notes}
              </span>
              <textarea
                {...register("notes")}
                rows={3}
                className={`${inputClassName} resize-none`}
              />
              {errors.notes ? (
                <span className="text-sm text-danger">
                  {errors.notes.message}
                </span>
              ) : null}
            </label>
          </div>

          <AppDialogFooter errorMessage={errors.root?.message}>
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
              disabled={isPending}
            >
              {PATIENT_FILES_COPY.edit.cancel}
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending
                ? PATIENT_FILES_COPY.edit.pending
                : PATIENT_FILES_COPY.edit.submit}
            </Button>
          </AppDialogFooter>
        </form>
      </AppDialogContent>
    </AppDialog>
  );
}
