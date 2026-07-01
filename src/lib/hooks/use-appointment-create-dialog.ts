import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "react-toastify";
import type { z } from "zod";

import { APPOINTMENT_CREATE_COPY } from "@/copy/appointment-create-copy";
import { useClinicId } from "@/lib/hooks/use-active-clinic";
import {
  useCreateAppointment,
  useUpdateAppointment,
} from "@/lib/hooks/use-appointments";
import { useDebouncedValue } from "@/lib/hooks/use-debounced-value";
import { useEmployees } from "@/lib/hooks/use-employees";
import { usePatient, usePatients } from "@/lib/hooks/use-patients";
import { useTreatmentTypes } from "@/lib/hooks/use-treatment-types";
import {
  appointmentSchema,
  appointmentUpdateSchema,
} from "@/lib/schemas/appointment-schema";
import { formatZodError } from "@/lib/schemas/schema-helpers";
import type { AppointmentWithRelations } from "@/types/database.types";

const PATIENT_SEARCH_DEBOUNCE_MS = 300;

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
): AppointmentFormValues {
  if (appointment) {
    return {
      patientId: appointment.patient_id,
      employeeId: appointment.employee_id,
      startsAt: new Date(appointment.starts_at),
      treatmentTypeIds: appointment.appointment_treatments
        .map((entry) => entry.treatment_types?.id)
        .filter((id): id is string => Boolean(id)),
      notes: appointment.notes ?? "",
    };
  }

  return {
    patientId: "",
    employeeId: "",
    startsAt: initialStartsAt ?? createDefaultStartsAt(),
    treatmentTypeIds: [],
    notes: "",
  };
}

export function useAppointmentCreateDialog(
  onSuccess: () => void,
  appointment?: AppointmentWithRelations | null,
  initialStartsAt?: Date | null,
) {
  const clinicId = useClinicId();
  const { mutate, isPending: isCreating } = useCreateAppointment();
  const { mutateAsync: updateAppointment, isPending: isUpdating } =
    useUpdateAppointment();
  const [patientSearch, setPatientSearch] = useState("");
  const isEditing = Boolean(appointment);

  const debouncedPatientSearch = useDebouncedValue(
    patientSearch,
    PATIENT_SEARCH_DEBOUNCE_MS,
  );

  const patients = usePatients(debouncedPatientSearch);
  const employees = useEmployees();
  const treatmentTypes = useTreatmentTypes();

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
    defaultValues: createDefaultValues(appointment, initialStartsAt),
  });

  useEffect(() => {
    reset(createDefaultValues(appointment, initialStartsAt));
  }, [appointment, initialStartsAt, reset]);

  const patientId = useWatch({ control, name: "patientId" }) ?? "";
  const treatmentTypeIds =
    useWatch({ control, name: "treatmentTypeIds" }) ?? [];

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

  const patientsSearching =
    patientSearch.trim() !== debouncedPatientSearch.trim() ||
    (patients.isLoading && patients.data !== undefined);

  const activeEmployees = useMemo(
    () =>
      (employees.data ?? []).filter((employee) => employee.active !== false),
    [employees.data],
  );

  const resetDialog = useCallback(() => {
    reset(createDefaultValues(appointment, initialStartsAt));
    setPatientSearch("");
  }, [reset, appointment, initialStartsAt]);

  const toggleTreatmentType = useCallback(
    (treatmentTypeId: string) => {
      const current = getValues("treatmentTypeIds");

      if (current.includes(treatmentTypeId)) {
        setValue(
          "treatmentTypeIds",
          current.filter((id) => id !== treatmentTypeId),
        );
        return;
      }

      setValue("treatmentTypeIds", [...current, treatmentTypeId]);
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
    treatmentTypeIds,
    toggleTreatmentType,
    patientSearch,
    setPatientSearch,
    patients: patientsForPicker,
    patientsLoading: patientsInitialLoading,
    patientsSearching,
    employees: activeEmployees,
    employeesLoading: employees.isLoading,
    treatmentTypes: treatmentTypes.data ?? [],
    treatmentTypesLoading: treatmentTypes.isLoading,
    isPending: isCreating || isUpdating || isSubmitting,
    reset: resetDialog,
    handleSubmit: onSubmit,
    isEditing,
  };
}
