import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { z } from "zod";

import { PROFILE_EDIT_COPY } from "@/copy/profile-edit-copy";
import {
  formatZodError,
  nullableSpanishPhone,
  nullableTrimmedString,
} from "@/lib/schemas/schema-helpers";
import { useAuthStore } from "@/stores/auth-store";
import type { Employee } from "@/types/database.types";

const profileEditFormSchema = z.object({
  full_name: z
    .string()
    .trim()
    .min(2, "El nombre debe tener al menos 2 caracteres.")
    .max(100, "El nombre es demasiado largo."),
  specialty: nullableTrimmedString(100, "La especialidad es demasiado larga."),
  phone: nullableSpanishPhone(),
  color: z
    .union([z.null(), z.literal(""), z.string().trim().max(7)])
    .transform((value) => (value === "" ? null : value)),
});

export type ProfileEditFormValues = z.input<typeof profileEditFormSchema>;

function toFormValues(profile: Employee): ProfileEditFormValues {
  return {
    full_name: profile.full_name,
    specialty: profile.specialty ?? "",
    phone: profile.phone ?? "",
    color: profile.color ?? "",
  };
}

export function useProfileEditDialog(profile: Employee, onSuccess: () => void) {
  const updateProfile = useAuthStore((state) => state.updateProfile);
  const isPending = useAuthStore((state) => state.updating);

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ProfileEditFormValues>({
    resolver: zodResolver(profileEditFormSchema),
    defaultValues: toFormValues(profile),
  });

  useEffect(() => {
    reset(toFormValues(profile));
  }, [profile, reset]);

  const onSubmit = handleSubmit(async (data) => {
    const parsed = profileEditFormSchema.safeParse(data);

    if (!parsed.success) {
      toast.error(formatZodError(parsed.error));
      return;
    }

    try {
      await updateProfile({
        full_name: parsed.data.full_name,
        specialty: parsed.data.specialty,
        phone: parsed.data.phone,
        color: parsed.data.color,
      });
      toast.success(PROFILE_EDIT_COPY.success);
      onSuccess();
    } catch (cause) {
      toast.error(
        cause instanceof Error ? cause.message : PROFILE_EDIT_COPY.error,
      );
    }
  });

  return {
    register,
    control,
    errors,
    isPending: isPending || isSubmitting,
    reset: () => reset(toFormValues(profile)),
    handleSubmit: onSubmit,
  };
}
