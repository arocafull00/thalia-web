"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { z } from "zod";

import { CLINIC_HOURS_COPY } from "@/copy/clinic-hours-copy";
import {
  getFutureAppointments,
  type FutureAppointmentConflict,
} from "@/dal/appointments.dal";
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

function isConflicting(
  startsAt: Date,
  newHours: ClinicHoursFormValues,
): boolean {
  const jsDay = startsAt.getDay();
  const isoDay = jsDay === 0 ? 7 : jsDay;
  if (!newHours.open_days.includes(isoDay)) return true;
  const hh = String(startsAt.getHours()).padStart(2, "0");
  const mm = String(startsAt.getMinutes()).padStart(2, "0");
  const time = `${hh}:${mm}`;
  return time < newHours.opening_time || time >= newHours.closing_time;
}

export function useClinicHoursDialog(
  clinic: ClinicInfo | null,
  onSuccess: () => void,
) {
  const activeClinicId = useClinicStore((s) => s.activeClinicId);
  const [conflicts, setConflicts] = useState<
    FutureAppointmentConflict[] | null
  >(null);
  const [pendingData, setPendingData] = useState<ClinicHoursFormValues | null>(
    null,
  );
  const [isConfirming, setIsConfirming] = useState(false);

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

  async function saveHours(data: ClinicHoursFormValues) {
    if (!activeClinicId) return;
    try {
      await updateClinicHours(activeClinicId, {
        opening_time: data.opening_time,
        closing_time: data.closing_time,
        open_days: data.open_days,
        timezone: data.timezone,
      });
      toast.success(CLINIC_HOURS_COPY.success);
      setConflicts(null);
      setPendingData(null);
      onSuccess();
    } catch (cause) {
      setError("root", {
        message:
          cause instanceof Error ? cause.message : CLINIC_HOURS_COPY.error,
      });
    }
  }

  const onSubmit = handleSubmit(async (data) => {
    clearErrors("root");
    if (!activeClinicId) return;

    const parsed = clinicHoursSchema.safeParse(data);
    if (!parsed.success) {
      setError("root", { message: parsed.error.issues[0]?.message });
      return;
    }

    let futureAppointments: FutureAppointmentConflict[] = [];
    try {
      futureAppointments = await getFutureAppointments(activeClinicId);
    } catch {
      toast.error(CLINIC_HOURS_COPY.conflicts.fetchError);
    }

    const conflicting = futureAppointments.filter((appt) =>
      isConflicting(new Date(appt.starts_at), parsed.data),
    );

    if (conflicting.length > 0) {
      setPendingData(parsed.data);
      setConflicts(conflicting);
      return;
    }

    await saveHours(parsed.data);
  });

  const confirmSave = async () => {
    if (!pendingData) return;
    setIsConfirming(true);
    try {
      await saveHours(pendingData);
    } finally {
      setIsConfirming(false);
    }
  };

  const cancelConflict = () => {
    setConflicts(null);
    setPendingData(null);
  };

  return {
    register,
    control,
    errors,
    conflicts,
    isPending: isSubmitting || isConfirming,
    reset: () => {
      reset(clinic ? toFormValues(clinic) : EMPTY_DEFAULTS);
      setConflicts(null);
      setPendingData(null);
    },
    handleSubmit: onSubmit,
    confirmSave,
    cancelConflict,
  };
}
