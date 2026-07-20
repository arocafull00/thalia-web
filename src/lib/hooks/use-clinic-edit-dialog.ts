"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { z } from "zod";

import { CLINIC_EDIT_COPY } from "@/copy/clinic-edit-copy";
import { updateClinic } from "@/dal/clinics.dal";
import type { ClinicInfo } from "@/lib/hooks/use-clinic-info";
import {
  formatZodError,
  nullableTrimmedString,
} from "@/lib/schemas/schema-helpers";
import { useClinicStore } from "@/stores/clinic-store";

const clinicEditFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "El nombre debe tener al menos 2 caracteres.")
    .max(100, "El nombre es demasiado largo."),
  phone: nullableTrimmedString(30, "El teléfono es demasiado largo."),
  address: nullableTrimmedString(200, "La dirección es demasiado larga."),
  specialty: nullableTrimmedString(100, "La especialidad es demasiado larga."),
});

export type ClinicEditFormValues = z.input<typeof clinicEditFormSchema>;

function toFormValues(clinic: ClinicInfo): ClinicEditFormValues {
  return {
    name: clinic.name,
    phone: clinic.phone ?? "",
    address: clinic.address ?? "",
    specialty: clinic.specialty ?? "",
  };
}

const EMPTY_DEFAULTS: ClinicEditFormValues = {
  name: "",
  phone: "",
  address: "",
  specialty: "",
};

export function useClinicEditDialog(
  clinic: ClinicInfo | null,
  onSuccess: () => void,
) {
  const activeClinicId = useClinicStore((s) => s.activeClinicId);

  const {
    register,
    handleSubmit,
    reset,
    setError,
    clearErrors,
    formState: { errors, isSubmitting },
  } = useForm<ClinicEditFormValues>({
    resolver: zodResolver(clinicEditFormSchema),
    defaultValues: clinic ? toFormValues(clinic) : EMPTY_DEFAULTS,
  });

  useEffect(() => {
    if (clinic) reset(toFormValues(clinic));
  }, [clinic, reset]);

  const onSubmit = handleSubmit(async (data) => {
    clearErrors("root");
    if (!activeClinicId) return;

    const parsed = clinicEditFormSchema.safeParse(data);
    if (!parsed.success) {
      setError("root", { message: formatZodError(parsed.error) });
      return;
    }

    try {
      await updateClinic(activeClinicId, {
        name: parsed.data.name,
        phone: parsed.data.phone,
        address: parsed.data.address,
        specialty: parsed.data.specialty,
      });
      toast.success(CLINIC_EDIT_COPY.success);
      onSuccess();
    } catch (cause) {
      setError("root", {
        message:
          cause instanceof Error ? cause.message : CLINIC_EDIT_COPY.error,
      });
    }
  });

  return {
    register,
    errors,
    isPending: isSubmitting,
    reset: () => reset(clinic ? toFormValues(clinic) : EMPTY_DEFAULTS),
    handleSubmit: onSubmit,
  };
}
