import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { PATIENT_GALLERY_COPY } from "@/copy/patient-gallery-copy";
import { useClinicId } from "@/lib/hooks/use-active-clinic";
import { useUploadPatientImages } from "@/lib/hooks/use-patient-images";
import {
  patientImageUploadSchema,
  type PatientImageUploadInput,
} from "@/lib/schemas/patient-image-schema";
import { formatZodError } from "@/lib/schemas/schema-helpers";
import { notifySuccess } from "@/lib/sound";

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

function createSelectedFilesStore() {
  let files: File[] = [];

  return {
    get: () => files,
    set: (nextFiles: File[]) => {
      files = nextFiles;
    },
  };
}

export function usePatientImageUploader(
  patientId: string,
  onSuccess: () => void,
) {
  const clinicId = useClinicId();
  const { mutateAsync, isPending, progress, currentFile, totalFiles } =
    useUploadPatientImages();
  const [selectedFilesStore] = useState(createSelectedFilesStore);

  const {
    register,
    control,
    handleSubmit,
    reset,
    setError,
    clearErrors,
    formState: { errors, isSubmitting },
  } = useForm<PatientImageFormValues>({
    resolver: zodResolver(patientImageFormSchema),
    defaultValues,
  });

  const resetForm = useCallback(() => {
    reset(defaultValues);
    selectedFilesStore.set([]);
  }, [reset, selectedFilesStore]);

  const setFiles = useCallback(
    (files: File[]) => {
      selectedFilesStore.set(files);
    },
    [selectedFilesStore],
  );

  const onSubmit = handleSubmit(
    async (data) => {
      clearErrors("root");

      if (!clinicId) {
        setError("root", {
          message: PATIENT_GALLERY_COPY.uploader.validation.clinicRequired,
        });
        return;
      }

      const selectedFiles = selectedFilesStore.get();

      if (selectedFiles.length === 0) {
        setError("root", {
          message: PATIENT_GALLERY_COPY.uploader.validation.fileRequired,
        });
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
        setError("root", { message: formatZodError(parsed.error) });
        return;
      }

      try {
        const images = await mutateAsync({
          clinicId,
          patientId,
          files: selectedFiles,
          metadata: parsed.data as PatientImageUploadInput,
        });
        notifySuccess(PATIENT_GALLERY_COPY.uploader.success(images.length));
        resetForm();
        onSuccess();
      } catch (cause) {
        setError("root", {
          message:
            cause instanceof Error
              ? cause.message
              : PATIENT_GALLERY_COPY.uploader.error,
        });
      }
    },
    () => clearErrors("root"),
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
    setFiles,
    resetForm,
  };
}
