import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { z } from "zod";

import { PATIENT_FILES_COPY } from "@/copy/patient-files-copy";
import { useClinicId } from "@/lib/hooks/use-active-clinic";
import { useUploadPatientFiles } from "@/lib/hooks/use-patient-files";
import { validatePatientFile } from "@/lib/patient-file-storage";
import {
  patientFileUploadSchema,
  type PatientFileUploadInput,
} from "@/lib/schemas/patient-file-schema";
import { formatZodError } from "@/lib/schemas/schema-helpers";

const patientFileFormSchema = patientFileUploadSchema.extend({
  category: z
    .string()
    .min(1, PATIENT_FILES_COPY.uploader.validation.categoryRequired),
});

export type PatientFileFormValues = z.input<typeof patientFileFormSchema>;

const defaultValues: PatientFileFormValues = {
  category: "",
  notes: "",
};

export function usePatientFileUploader(
  patientId: string,
  onSuccess: () => void,
) {
  const clinicId = useClinicId();
  const { mutateAsync, isPending, progress, currentFile, totalFiles } =
    useUploadPatientFiles();
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const {
    register,
    control,
    handleSubmit,
    reset,
    setError,
    clearErrors,
    formState: { errors, isSubmitting },
  } = useForm<PatientFileFormValues>({
    resolver: zodResolver(patientFileFormSchema),
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
      clearErrors("root");

      if (!clinicId) {
        setError("root", {
          message: PATIENT_FILES_COPY.uploader.validation.clinicRequired,
        });
        return;
      }

      if (selectedFiles.length === 0) {
        setError("root", {
          message: PATIENT_FILES_COPY.uploader.validation.fileRequired,
        });
        return;
      }

      for (const file of selectedFiles) {
        try {
          validatePatientFile(file);
        } catch (cause) {
          setError("root", {
            message:
              cause instanceof Error
                ? cause.message
                : PATIENT_FILES_COPY.uploader.validation.invalidFile,
          });
          return;
        }
      }

      const parsed = patientFileUploadSchema.safeParse({
        category: data.category,
        notes: data.notes,
      });

      if (!parsed.success) {
        setError("root", { message: formatZodError(parsed.error) });
        return;
      }

      try {
        const files = await mutateAsync({
          clinicId,
          patientId,
          files: selectedFiles,
          metadata: parsed.data as PatientFileUploadInput,
        });
        toast.success(PATIENT_FILES_COPY.uploader.success(files.length));
        resetForm();
        onSuccess();
      } catch (cause) {
        setError("root", {
          message:
            cause instanceof Error
              ? cause.message
              : PATIENT_FILES_COPY.uploader.error,
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
    selectedFiles,
    setFiles,
    resetForm,
  };
}
