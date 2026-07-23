"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { z } from "zod";

import { CLINIC_HOURS_COPY } from "@/copy/clinic-hours-copy";
import { updateClinicHours } from "@/dal/clinics.dal";
import type { ClinicInfo } from "@/lib/hooks/use-clinic-info";
import { useClinicStore } from "@/stores/clinic-store";

const TIME_REGEX = /^\d{2}:\d{2}$/;

const clinicHoursSchema = z
  .object({
    opening_time: z.string().regex(TIME_REGEX, "Formato HH:MM requerido"),
    closing_time: z.string().regex(TIME_REGEX, "Formato HH:MM requerido"),
    open_days: z
      .array(z.number().int().min(1).max(7))
      .min(1, CLINIC_HOURS_COPY.fields.atLeastOneDay),
    timezone: z.string().min(1),
  })
  .refine((data) => data.opening_time < data.closing_time, {
    message: CLINIC_HOURS_COPY.fields.closingAfterOpening,
    path: ["closing_time"],
  });

export type ClinicHoursFormValues = z.input<typeof clinicHoursSchema>;

function toFormValues(clinic: ClinicInfo): ClinicHoursFormValues {
  return {
    opening_time: clinic.opening_time.substring(0, 5),
    closing_time: clinic.closing_time.substring(0, 5),
    open_days: clinic.open_days,
    timezone: clinic.timezone,
  };
}

const EMPTY_DEFAULTS: ClinicHoursFormValues = {
  opening_time: "09:00",
  closing_time: "18:00",
  open_days: [1, 2, 3, 4, 5],
  timezone: "Europe/Madrid",
};

export function useClinicHoursDialog(
  clinic: ClinicInfo | null,
  onSuccess: () => void,
) {
  const activeClinicId = useClinicStore((s) => s.activeClinicId);

  const {
    register,
    control,
    handleSubmit,
    reset,
    setError,
    clearErrors,
    formState: { errors, isSubmitting },
  } = useForm<ClinicHoursFormValues>({
    resolver: zodResolver(clinicHoursSchema),
    defaultValues: clinic ? toFormValues(clinic) : EMPTY_DEFAULTS,
  });

  useEffect(() => {
    if (clinic) reset(toFormValues(clinic));
  }, [clinic, reset]);

  const onSubmit = handleSubmit(async (data) => {
    clearErrors("root");
    if (!activeClinicId) return;

    const parsed = clinicHoursSchema.safeParse(data);
    if (!parsed.success) {
      setError("root", { message: parsed.error.issues[0]?.message });
      return;
    }

    try {
      await updateClinicHours(activeClinicId, {
        opening_time: parsed.data.opening_time,
        closing_time: parsed.data.closing_time,
        open_days: parsed.data.open_days,
        timezone: parsed.data.timezone,
      });
      toast.success(CLINIC_HOURS_COPY.success);
      onSuccess();
    } catch (cause) {
      setError("root", {
        message:
          cause instanceof Error ? cause.message : CLINIC_HOURS_COPY.error,
      });
    }
  });

  return {
    register,
    control,
    errors,
    isPending: isSubmitting,
    reset: () => reset(clinic ? toFormValues(clinic) : EMPTY_DEFAULTS),
    handleSubmit: onSubmit,
  };
}
