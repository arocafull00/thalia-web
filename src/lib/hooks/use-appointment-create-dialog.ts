import { zodResolver } from "@hookform/resolvers/zod";
import { addDays } from "date-fns";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "react-toastify";
import type { z } from "zod";

import { APPOINTMENT_CREATE_COPY } from "@/copy/appointment-create-copy";
import { getAppointments } from "@/dal/appointments.dal";
import { findAvailableSlots } from "@/lib/find-slots";
import { useClinicId } from "@/lib/hooks/use-active-clinic";
import {
  useCreateAppointment,
  useUpdateAppointment,
} from "@/lib/hooks/use-appointments";
import { useClinicInfo } from "@/lib/hooks/use-clinic-info";
import type { ClinicInfo } from "@/lib/hooks/use-clinic-info";
import { useEmployees } from "@/lib/hooks/use-employees";
import { usePatient, usePatients } from "@/lib/hooks/use-patients";
import { useTreatments } from "@/lib/hooks/use-treatment";
import {
  appointmentSchema,
  appointmentUpdateSchema,
} from "@/lib/schemas/appointment-schema";
import { formatZodError } from "@/lib/schemas/schema-helpers";
import { notifySuccess } from "@/lib/sound";
import type { AppointmentWithRelations } from "@/types/database.types";

const appointmentFormSchema = appointmentSchema.omit({ clinicId: true });

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

export type AppointmentFormValues = z.input<typeof appointmentFormSchema>;

function createDefaultStartsAt() {
  const date = new Date();

  date.setMinutes(0, 0, 0);
  date.setHours(date.getHours() + 1);

  return date;
}

function createDefaultValues(
  appointment?: AppointmentWithRelations | null,
  initialStartsAt?: Date | null,
  initialPatientId?: string | null,
): AppointmentFormValues {
  if (appointment) {
    return {
      patientId: appointment.patient_id,
      employeeId: appointment.employee_id,
      startsAt: new Date(appointment.starts_at),
      treatmentIds: appointment.appointment_treatments
        .map((entry) => entry.treatment?.id)
        .filter((id): id is string => Boolean(id)),
      notes: appointment.notes ?? "",
    };
  }

  return {
    patientId: initialPatientId ?? "",
    employeeId: "",
    startsAt: initialStartsAt ?? createDefaultStartsAt(),
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
  const { clinic } = useClinicInfo();
  const [slotsOpen, setSlotsOpen] = useState(false);
  const [slots, setSlots] = useState<Date[]>([]);
  const [slotsLoading, setSlotsLoading] = useState(false);
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
    ),
  });

  useEffect(() => {
    reset(createDefaultValues(appointment, initialStartsAt, initialPatientId));
  }, [appointment, initialPatientId, initialStartsAt, reset]);

  const patientId = useWatch({ control, name: "patientId" }) ?? "";
  const rawTreatmentIds = useWatch({ control, name: "treatmentIds" });
  const treatmentIds = useMemo(() => rawTreatmentIds ?? [], [rawTreatmentIds]);

  const selectedPatient = usePatient(patientId);

  const patientsForPicker = useMemo(() => {
    const list = patients.data ?? [];

    if (!patientId) {
      return list;
    }

    if (list.some((patient) => patient.id === patientId)) {
      return list;
    }

    if (selectedPatient.data) {
      return [selectedPatient.data, ...list];
    }

    return list;
  }, [patientId, patients.data, selectedPatient.data]);

  const patientsInitialLoading =
    patients.isLoading && patients.data === undefined;

  const activeEmployees = useMemo(
    () =>
      (employees.data ?? []).filter((employee) => employee.active !== false),
    [employees.data],
  );

  const resetDialog = useCallback(() => {
    reset(createDefaultValues(appointment, initialStartsAt, initialPatientId));
    setSlotsOpen(false);
    setSlots([]);
  }, [reset, appointment, initialPatientId, initialStartsAt]);

  const openSlots = useCallback(async () => {
    if (!clinicId || !clinic) return;

    const totalDuration = (treatments.data ?? [])
      .filter((t) => treatmentIds.includes(t.id))
      .reduce((sum, t) => sum + (t.duration_minutes ?? 30), 0);

    const employeeId = getValues("employeeId") || null;
    const now = new Date();

    setSlotsLoading(true);
    setSlotsOpen(true);
    setSlots([]);

    try {
      const existing = await getAppointments({
        startIso: now.toISOString(),
        endIso: addDays(now, 30).toISOString(),
        clinicId,
        employeeId,
      });

      const found = findAvailableSlots({
        existing,
        clinic,
        durationMinutes: totalDuration || 30,
        from: now,
      });

      setSlots(found);
    } catch {
      toast.error(APPOINTMENT_CREATE_COPY.findSlots.fetchError);
      setSlotsOpen(false);
    } finally {
      setSlotsLoading(false);
    }
  }, [clinic, clinicId, getValues, treatmentIds, treatments.data]);

  const closeSlots = useCallback(() => setSlotsOpen(false), []);

  const selectSlot = useCallback(
    (date: Date) => {
      setValue("startsAt", date);
      setSlotsOpen(false);
    },
    [setValue],
  );

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

      if (isEditing && appointment) {
        const parsed = appointmentUpdateSchema.safeParse({
          id: appointment.id,
          clinicId,
          ...data,
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
        ...data,
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
    openSlots,
    closeSlots,
    selectSlot,
    reset: resetDialog,
    handleSubmit: onSubmit,
    isEditing,
  };
}
