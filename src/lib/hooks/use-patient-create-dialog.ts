import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { useCallback, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { z } from "zod";

import { getProfileInitials } from "@/components/ui/profile/profile-header";
import { PATIENT_CREATE_COPY } from "@/copy/patient-create-copy";
import { useClinicId } from "@/lib/hooks/use-active-clinic";
import {
  useCreatePatient,
  useUploadPatientAvatar,
} from "@/lib/hooks/use-patients";
import { compressAvatarImage } from "@/lib/image-compression";
import { patientSchema } from "@/lib/schemas/patient-schema";
import { formatZodError } from "@/lib/schemas/schema-helpers";

const patientFormSchema = patientSchema
  .omit({ clinic_id: true, birth_date: true })
  .extend({
    birth_date: z.date().nullable(),
  });

export type PatientFormValues = z.input<typeof patientFormSchema>;

const defaultValues: PatientFormValues = {
  full_name: "",
  dni: "",
  birth_date: null,
  phone: "",
  email: "",
  address: "",
  notes: "",
};

export function usePatientCreateDialog(onSuccess: () => void) {
  const clinicId = useClinicId();
  const { mutateAsync, isPending } = useCreatePatient();
  const uploadPatientAvatar = useUploadPatientAvatar();
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreviewUri, setAvatarPreviewUri] = useState<string | null>(null);
  const avatarPreviewUriRef = useRef<string | null>(null);

  const {
    register,
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<PatientFormValues>({
    resolver: zodResolver(patientFormSchema),
    defaultValues,
  });

  const fullName = watch("full_name");
  const avatarInitials = getProfileInitials(fullName);

  const resetAvatar = useCallback(() => {
    if (avatarPreviewUriRef.current) {
      URL.revokeObjectURL(avatarPreviewUriRef.current);
      avatarPreviewUriRef.current = null;
    }

    setAvatarFile(null);
    setAvatarPreviewUri(null);
  }, []);

  const handleAvatarFileSelected = useCallback(async (file: File) => {
    const compressedFile = await compressAvatarImage(file);

    if (avatarPreviewUriRef.current) {
      URL.revokeObjectURL(avatarPreviewUriRef.current);
    }

    const previewUrl = URL.createObjectURL(compressedFile);
    avatarPreviewUriRef.current = previewUrl;
    setAvatarFile(compressedFile);
    setAvatarPreviewUri(previewUrl);
  }, []);

  const onSubmit = handleSubmit(async (data) => {
    if (!clinicId) {
      toast.error(PATIENT_CREATE_COPY.validation.clinicRequired);
      return;
    }

    const parsed = patientSchema.safeParse({
      clinic_id: clinicId,
      full_name: data.full_name,
      dni: data.dni,
      birth_date: data.birth_date
        ? format(data.birth_date, "yyyy-MM-dd")
        : null,
      phone: data.phone,
      email: data.email,
      address: data.address,
      notes: data.notes,
    });

    if (!parsed.success) {
      toast.error(formatZodError(parsed.error));
      return;
    }

    try {
      const created = await mutateAsync(parsed.data);

      if (avatarFile) {
        await uploadPatientAvatar.mutateAsync({
          patientId: created.id,
          file: avatarFile,
        });
      }

      toast.success(PATIENT_CREATE_COPY.success);
      reset(defaultValues);
      resetAvatar();
      onSuccess();
    } catch (cause) {
      toast.error(
        cause instanceof Error ? cause.message : PATIENT_CREATE_COPY.error,
      );
    }
  });

  return {
    register,
    control,
    errors,
    isPending: isPending || isSubmitting || uploadPatientAvatar.isPending,
    reset: () => {
      reset(defaultValues);
      resetAvatar();
    },
    handleSubmit: onSubmit,
    avatarDisplayUri: avatarPreviewUri,
    avatarInitials,
    avatarUploadPending: uploadPatientAvatar.isPending,
    onAvatarFileSelected: handleAvatarFileSelected,
  };
}
