import { zodResolver } from "@hookform/resolvers/zod";
import { startOfDay } from "date-fns";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "react-toastify";
import type { z } from "zod";

import type { AppointmentPatientOption } from "@/components/appointments/components/appointment-create-form";
import { APPOINTMENT_CREATE_COPY } from "@/copy/appointment-create-copy";
import { getAppointments } from "@/dal/appointments.dal";
import {
  clinicWallDateToIso,
  getClinicRangeIso,
  instantToClinicWallDate,
} from "@/lib/appointment-datetime";
import {
  findAvailableSlots,
  getSlotSearchRange,
  type SlotSearchMode,
} from "@/lib/find-slots";
import {
  useActiveClinicTimezone,
  useClinicId,
} from "@/lib/hooks/use-active-clinic";
import {
  useCreateAppointment,
  useUpdateAppointment,
} from "@/lib/hooks/use-appointments";
import { useClinicInfo } from "@/lib/hooks/use-clinic-info";
import type { ClinicInfo } from "@/lib/hooks/use-clinic-info";
import { useEmployees } from "@/lib/hooks/use-employees";
import { usePatients } from "@/lib/hooks/use-patients";
import { useTreatments } from "@/lib/hooks/use-treatment";
import { logger } from "@/lib/logger";
import {
  appointmentSchema,
  appointmentFormSchema,
  appointmentUpdateSchema,
} from "@/lib/schemas/appointment-schema";
import { formatZodError } from "@/lib/schemas/schema-helpers";
import { notifySuccess } from "@/lib/sound";
import type { AppointmentWithRelations } from "@/types/database.types";

function jsDateToIsoDay(date: Date): number {
  const d = date.getDay(); // 0=Sun...6=Sat
  return d === 0 ? 7 : d; // 1=Mon...7=Sun
}

function isClinicOpenOnDate(date: Date, clinic: ClinicInfo): boolean {
  return clinic.open_days.includes(jsDateToIsoDay(date));
}

function isWithinClinicHours(date: Date, clinic: ClinicInfo): boolean {
  const hh = String(date.getHours()).padStart(2, "0");
  const mm = String(date.getMinutes()).padStart(2, "0");
  const time = `${hh}:${mm}`;
  return (
    time >= clinic.opening_time.substring(0, 5) &&
    time < clinic.closing_time.substring(0, 5)
  );
}

function isPastInstant(iso: string): boolean {
  return new Date(iso).getTime() <= Date.now();
}

export type AppointmentFormValues = z.input<typeof appointmentFormSchema>;

function createDefaultStartsAt(timezone: string) {
  const date = instantToClinicWallDate(new Date(), timezone);

  date.setMinutes(0, 0, 0);
  date.setHours(date.getHours() + 1);

  return date;
}

function createDefaultValues(
  appointment?: AppointmentWithRelations | null,
  initialStartsAt?: Date | null,
  initialPatientId?: string | null,
  timezone = "Europe/Madrid",
): AppointmentFormValues {
  if (appointment) {
    return {
      patientId: appointment.patient_id,
      employeeId: appointment.employee_id,
      startsAt: instantToClinicWallDate(appointment.starts_at, timezone),
      treatmentIds: appointment.appointment_treatments
        .map((entry) => entry.treatment?.id)
        .filter((id): id is string => Boolean(id)),
      notes: appointment.notes ?? "",
    };
  }

  return {
    patientId: initialPatientId ?? "",
    employeeId: "",
    startsAt: initialStartsAt ?? createDefaultStartsAt(timezone),
    treatmentIds: [],
    notes: "",
  };
}

export function useAppointmentCreateDialog(
  onSuccess: () => void,
  appointment?: AppointmentWithRelations | null,
  initialStartsAt?: Date | null,
  initialPatientId?: string | null,
) {
  const clinicId = useClinicId();
  const activeClinicTimezone = useActiveClinicTimezone();
  const { clinic } = useClinicInfo();
  const timezone = clinic?.timezone ?? activeClinicTimezone;
  const [slotsOpen, setSlotsOpen] = useState(false);
  const [slots, setSlots] = useState<Date[]>([]);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [slotSearchMode, setSlotSearchMode] = useState<SlotSearchMode>("asap");
  const [invalidLocalTime, setInvalidLocalTime] = useState(false);
  const { mutate, isPending: isCreating } = useCreateAppointment();
  const { mutateAsync: updateAppointment, isPending: isUpdating } =
    useUpdateAppointment();
  const isEditing = Boolean(appointment);

  const patients = usePatients("");
  const employees = useEmployees();
  const treatments = useTreatments();

  const {
    register,
    control,
    handleSubmit,
    reset,
    setValue,
    setError,
    clearErrors,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<AppointmentFormValues>({
    resolver: zodResolver(appointmentFormSchema),
    defaultValues: createDefaultValues(
      appointment,
      initialStartsAt,
      initialPatientId,
      timezone,
    ),
  });

  useEffect(() => {
    reset(
      createDefaultValues(
        appointment,
        initialStartsAt,
        initialPatientId,
        timezone,
      ),
    );
  }, [appointment, initialPatientId, initialStartsAt, reset, timezone]);

  const patientId = useWatch({ control, name: "patientId" }) ?? "";
  const rawTreatmentIds = useWatch({ control, name: "treatmentIds" });
  const treatmentIds = useMemo(() => rawTreatmentIds ?? [], [rawTreatmentIds]);
  const watchedStartsAt = useWatch({ control, name: "startsAt" });

  const showPastAppointmentWarning = useMemo(() => {
    if (!isEditing || !watchedStartsAt) {
      return false;
    }

    try {
      const startsAtIso = clinicWallDateToIso(watchedStartsAt, timezone);
      return isPastInstant(startsAtIso);
    } catch {
      return false;
    }
  }, [isEditing, timezone, watchedStartsAt]);

  const appointmentPatient = appointment?.patients ?? null;

  const patientsForPicker = useMemo<AppointmentPatientOption[]>(() => {
    const list = patients.data ?? [];

    if (!patientId) {
      return list;
    }

    if (list.some((patient) => patient.id === patientId)) {
      return list;
    }

    // El paciente de la cita ya viene embebido: no hace falta pedirlo aparte.
    if (appointmentPatient && appointmentPatient.id === patientId) {
      return [appointmentPatient, ...list];
    }

    return list;
  }, [appointmentPatient, patientId, patients.data]);

  const patientsInitialLoading =
    patients.isLoading && patients.data === undefined;

  const activeEmployees = useMemo(
    () =>
      (employees.data ?? []).filter((employee) => employee.active !== false),
    [employees.data],
  );

  const resetDialog = useCallback(() => {
    reset(
      createDefaultValues(
        appointment,
        initialStartsAt,
        initialPatientId,
        timezone,
      ),
    );
    setSlotsOpen(false);
    setSlots([]);
    setSlotSearchMode("asap");
    setInvalidLocalTime(false);
  }, [reset, appointment, initialPatientId, initialStartsAt, timezone]);

  const changeSlotSearchMode = useCallback((mode: SlotSearchMode) => {
    setSlotSearchMode(mode);
    setSlotsOpen(false);
    setSlots([]);
  }, []);

  const openSlots = useCallback(async () => {
    if (!clinicId || !clinic) return;

    const totalDuration = (treatments.data ?? [])
      .filter((t) => treatmentIds.includes(t.id))
      .reduce((sum, t) => sum + (t.duration_minutes ?? 30), 0);

    const employeeId = getValues("employeeId") || null;
    const now = instantToClinicWallDate(new Date(), timezone);
    const searchRange = getSlotSearchRange({
      from: now,
      searchMode: slotSearchMode,
    });

    setSlotsLoading(true);
    setSlotsOpen(true);
    setSlots([]);

    try {
      const { startIso, endIso } = getClinicRangeIso(
        startOfDay(searchRange.from),
        searchRange.to,
        timezone,
      );
      const existing = await getAppointments({
        startIso,
        endIso,
        clinicId,
        employeeId,
      });

      const found = findAvailableSlots({
        existing,
        clinic,
        durationMinutes: totalDuration || 30,
        from: now,
        searchMode: slotSearchMode,
      });

      setSlots(found);
    } catch (cause) {
      logger.captureException(cause, {
        hook: "use-appointment-create-dialog",
        action: "findAvailableSlots",
        clinicId,
        employeeId,
        slotSearchMode,
      });
      toast.error(APPOINTMENT_CREATE_COPY.findSlots.fetchError);
      setSlotsOpen(false);
    } finally {
      setSlotsLoading(false);
    }
  }, [
    clinic,
    clinicId,
    getValues,
    slotSearchMode,
    treatmentIds,
    treatments.data,
    timezone,
  ]);

  const closeSlots = useCallback(() => setSlotsOpen(false), []);

  const selectSlot = useCallback(
    (date: Date) => {
      setValue("startsAt", date);
      setInvalidLocalTime(false);
      clearErrors("startsAt");
      setSlotsOpen(false);
    },
    [clearErrors, setValue],
  );

  const markStartsAtInvalid = useCallback(() => {
    setInvalidLocalTime(true);
    setError("startsAt", {
      message: APPOINTMENT_CREATE_COPY.validation.invalidLocalTime,
    });
  }, [setError]);

  const markStartsAtValid = useCallback(() => {
    setInvalidLocalTime(false);
    clearErrors("startsAt");
  }, [clearErrors]);

  const toggleTreatment = useCallback(
    (treatmentId: string) => {
      const current = getValues("treatmentIds");

      if (current.includes(treatmentId)) {
        setValue(
          "treatmentIds",
          current.filter((id) => id !== treatmentId),
        );
        return;
      }

      setValue("treatmentIds", [...current, treatmentId]);
    },
    [getValues, setValue],
  );

  const onSubmit = handleSubmit(
    (data) => {
      clearErrors("root");

      if (invalidLocalTime) {
        setError("startsAt", {
          message: APPOINTMENT_CREATE_COPY.validation.invalidLocalTime,
        });
        return;
      }

      if (!clinicId) {
        const message = APPOINTMENT_CREATE_COPY.validation.clinicRequired;
        setError("root", { message });
        return;
      }

      if (clinic) {
        if (!isClinicOpenOnDate(data.startsAt, clinic)) {
          setError("root", {
            message: APPOINTMENT_CREATE_COPY.validation.closedDay,
          });
          return;
        }
        if (!isWithinClinicHours(data.startsAt, clinic)) {
          setError("root", {
            message: APPOINTMENT_CREATE_COPY.validation.outsideHours,
          });
          return;
        }
      }

      let startsAtIso: string;
      try {
        startsAtIso = clinicWallDateToIso(data.startsAt, timezone);
      } catch {
        setError("startsAt", {
          message: APPOINTMENT_CREATE_COPY.validation.invalidLocalTime,
        });
        return;
      }

      if (!isEditing && isPastInstant(startsAtIso)) {
        setError("startsAt", {
          message: APPOINTMENT_CREATE_COPY.validation.past,
        });
        return;
      }

      const { startsAt: _startsAt, ...formData } = data;

      if (isEditing && appointment) {
        const parsed = appointmentUpdateSchema.safeParse({
          id: appointment.id,
          clinicId,
          ...formData,
          startsAtIso,
          notes: data.notes?.trim() ? data.notes.trim() : null,
        });

        if (!parsed.success) {
          setError("root", { message: formatZodError(parsed.error) });
          return;
        }

        void updateAppointment(parsed.data)
          .then(() => {
            notifySuccess(APPOINTMENT_CREATE_COPY.successEdit);
            resetDialog();
            onSuccess();
          })
          .catch((cause) => {
            const message =
              cause instanceof Error
                ? cause.message
                : APPOINTMENT_CREATE_COPY.errorEdit;
            setError("root", { message });
          });

        return;
      }

      const parsed = appointmentSchema.safeParse({
        clinicId,
        ...formData,
        startsAtIso,
        notes: data.notes?.trim() ? data.notes.trim() : null,
      });

      if (!parsed.success) {
        setError("root", { message: formatZodError(parsed.error) });
        return;
      }

      mutate(parsed.data, {
        onSuccess: () => {
          notifySuccess(APPOINTMENT_CREATE_COPY.success);
          resetDialog();
          onSuccess();
        },
        onError: (cause) => {
          const message = cause.message || APPOINTMENT_CREATE_COPY.error;
          setError("root", { message });
        },
      });
    },
    () => clearErrors("root"),
  );

  return {
    register,
    control,
    errors,
    clinic,
    treatmentIds,
    toggleTreatment,
    patients: patientsForPicker,
    patientsLoading: patientsInitialLoading,
    employees: activeEmployees,
    employeesLoading: employees.isLoading,
    treatments: treatments.data ?? [],
    treatmentsLoading: treatments.isLoading,
    isPending: isCreating || isUpdating || isSubmitting,
    slotsOpen,
    slots,
    slotsLoading,
    slotSearchMode,
    changeSlotSearchMode,
    openSlots,
    closeSlots,
    selectSlot,
    reset: resetDialog,
    handleSubmit: onSubmit,
    isEditing,
    showPastAppointmentWarning,
    markStartsAtInvalid,
    markStartsAtValid,
  };
}
