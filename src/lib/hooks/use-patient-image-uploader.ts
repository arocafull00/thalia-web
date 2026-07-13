import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { useCallback, useState } from "react";
import { useForm, type FieldErrors } from "react-hook-form";
import { toast } from "react-toastify";
import { z } from "zod";

import { PATIENT_GALLERY_COPY } from "@/copy/patient-gallery-copy";
import { useClinicId } from "@/lib/hooks/use-active-clinic";
import { useUploadPatientImages } from "@/lib/hooks/use-patient-images";
import {
  patientImageUploadSchema,
  type PatientImageUploadInput,
} from "@/lib/schemas/patient-image-schema";
import { formatZodError } from "@/lib/schemas/schema-helpers";

const patientImageFormSchema = patientImageUploadSchema.extend({
  captured_at: z.date().nullable(),
});

export type PatientImageFormValues = z.input<typeof patientImageFormSchema>;

const defaultValues: PatientImageFormValues = {
  phase: "",
  treatment_id: "",
  notes: "",
  captured_at: null,
};

function getFirstFieldError(errors: FieldErrors): string | null {
  for (const value of Object.values(errors)) {
    if (!value || typeof value !== "object") {
      continue;
    }

    if ("message" in value && value.message) {
      return String(value.message);
    }

    const nested = getFirstFieldError(value as FieldErrors);
    if (nested) {
      return nested;
    }
  }

  return null;
}

export function usePatientImageUploader(
  patientId: string,
  onSuccess: () => void,
) {
  const clinicId = useClinicId();
  const { mutateAsync, isPending, progress, currentFile, totalFiles } =
    useUploadPatientImages();
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<PatientImageFormValues>({
    resolver: zodResolver(patientImageFormSchema),
    defaultValues,
  });

  const resetForm = useCallback(() => {
    reset(defaultValues);
    setSelectedFiles([]);
  }, [reset]);

  const setFiles = useCallback((files: File[]) => {
    setSelectedFiles(files);
  }, []);

  const onSubmit = handleSubmit(
    async (data) => {
      if (!clinicId) {
        toast.error(PATIENT_GALLERY_COPY.uploader.validation.clinicRequired);
        return;
      }

      if (selectedFiles.length === 0) {
        toast.error(PATIENT_GALLERY_COPY.uploader.validation.fileRequired);
        return;
      }

      const parsed = patientImageUploadSchema.safeParse({
        phase: data.phase,
        treatment_id: data.treatment_id,
        notes: data.notes,
        captured_at: data.captured_at
          ? format(data.captured_at, "yyyy-MM-dd")
          : null,
      });

      if (!parsed.success) {
        toast.error(formatZodError(parsed.error));
        return;
      }

      try {
        const images = await mutateAsync({
          clinicId,
          patientId,
          files: selectedFiles,
          metadata: parsed.data as PatientImageUploadInput,
        });
        toast.success(PATIENT_GALLERY_COPY.uploader.success(images.length));
        resetForm();
        onSuccess();
      } catch (cause) {
        toast.error(
          cause instanceof Error
            ? cause.message
            : PATIENT_GALLERY_COPY.uploader.error,
        );
      }
    },
    (fieldErrors) => {
      toast.error(
        getFirstFieldError(fieldErrors) ??
          PATIENT_GALLERY_COPY.uploader.validation.formInvalid,
      );
    },
  );

  return {
    register,
    control,
    errors,
    onSubmit,
    isPending: isPending || isSubmitting,
    progress,
    currentFile,
    totalFiles,
    selectedFiles,
    setFiles,
    resetForm,
  };
}
