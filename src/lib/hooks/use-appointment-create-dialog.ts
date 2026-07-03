import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useEffect, useMemo } from "react";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "react-toastify";
import type { z } from "zod";

import { APPOINTMENT_CREATE_COPY } from "@/copy/appointment-create-copy";
import { useClinicId } from "@/lib/hooks/use-active-clinic";
import {
  useCreateAppointment,
  useUpdateAppointment,
} from "@/lib/hooks/use-appointments";
import { useEmployees } from "@/lib/hooks/use-employees";
import { usePatient, usePatients } from "@/lib/hooks/use-patients";
import { useTreatments } from "@/lib/hooks/use-treatment";
import {
  appointmentSchema,
  appointmentUpdateSchema,
} from "@/lib/schemas/appointment-schema";
import { formatZodError } from "@/lib/schemas/schema-helpers";
import type { AppointmentWithRelations } from "@/types/database.types";

const appointmentFormSchema = appointmentSchema.omit({ clinicId: true });

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
  const treatmentIds = useWatch({ control, name: "treatmentIds" }) ?? [];

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
  }, [reset, appointment, initialPatientId, initialStartsAt]);

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
      if (!clinicId) {
        toast.error(APPOINTMENT_CREATE_COPY.validation.clinicRequired);
        return;
      }

      if (isEditing && appointment) {
        const parsed = appointmentUpdateSchema.safeParse({
          id: appointment.id,
          clinicId,
          ...data,
          notes: data.notes?.trim() ? data.notes.trim() : null,
        });

        if (!parsed.success) {
          toast.error(formatZodError(parsed.error));
          return;
        }

        void updateAppointment(parsed.data)
          .then(() => {
            toast.success(APPOINTMENT_CREATE_COPY.successEdit);
            resetDialog();
            onSuccess();
          })
          .catch((cause) => {
            toast.error(
              cause instanceof Error
                ? cause.message
                : APPOINTMENT_CREATE_COPY.errorEdit,
            );
          });

        return;
      }

      const parsed = appointmentSchema.safeParse({
        clinicId,
        ...data,
        notes: data.notes?.trim() ? data.notes.trim() : null,
      });

      if (!parsed.success) {
        toast.error(formatZodError(parsed.error));
        return;
      }

      mutate(parsed.data, {
        onSuccess: () => {
          toast.success(APPOINTMENT_CREATE_COPY.success);
          resetDialog();
          onSuccess();
        },
        onError: (cause) => {
          toast.error(cause.message || APPOINTMENT_CREATE_COPY.error);
        },
      });
    },
    (formErrors) => {
      console.error("Appointment form validation failed", {
        values: getValues(),
        errors: formErrors,
      });
    },
  );

  return {
    register,
    control,
    errors,
    treatmentIds,
    toggleTreatment,
    patients: patientsForPicker,
    patientsLoading: patientsInitialLoading,
    employees: activeEmployees,
    employeesLoading: employees.isLoading,
    treatments: treatments.data ?? [],
    treatmentsLoading: treatments.isLoading,
    isPending: isCreating || isUpdating || isSubmitting,
    reset: resetDialog,
    handleSubmit: onSubmit,
    isEditing,
  };
}
