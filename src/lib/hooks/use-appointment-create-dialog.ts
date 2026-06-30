import { useCallback, useMemo, useState } from "react";
import { toast } from "react-toastify";

import { APPOINTMENT_CREATE_COPY } from "@/copy/appointment-create-copy";
import { useClinicId } from "@/lib/hooks/use-active-clinic";
import { useCreateAppointment } from "@/lib/hooks/use-appointments";
import { useDebouncedValue } from "@/lib/hooks/use-debounced-value";
import { useEmployees } from "@/lib/hooks/use-employees";
import { usePatient, usePatients } from "@/lib/hooks/use-patients";
import { useTreatmentTypes } from "@/lib/hooks/use-treatment-types";

const PATIENT_SEARCH_DEBOUNCE_MS = 300;

function createDefaultStartsAt() {
  const date = new Date();

  date.setMinutes(0, 0, 0);

  date.setHours(date.getHours() + 1);

  return date;
}

export function useAppointmentCreateDialog(onSuccess: () => void) {
  const clinicId = useClinicId();

  const { mutate, isPending } = useCreateAppointment();

  const [patientSearch, setPatientSearch] = useState("");

  const debouncedPatientSearch = useDebouncedValue(
    patientSearch,
    PATIENT_SEARCH_DEBOUNCE_MS,
  );

  const patients = usePatients(debouncedPatientSearch);

  const employees = useEmployees();

  const treatmentTypes = useTreatmentTypes();

  const [patientId, setPatientId] = useState("");

  const [employeeId, setEmployeeId] = useState("");

  const [startsAt, setStartsAt] = useState(createDefaultStartsAt);

  const [treatmentTypeIds, setTreatmentTypeIds] = useState<string[]>([]);

  const [notes, setNotes] = useState("");

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

  const activeEmployees = useMemo(
    () =>
      (employees.data ?? []).filter((employee) => employee.active !== false),

    [employees.data],
  );

  const reset = useCallback(() => {
    setPatientId("");

    setEmployeeId("");

    setPatientSearch("");

    setStartsAt(createDefaultStartsAt());

    setTreatmentTypeIds([]);

    setNotes("");
  }, []);

  const toggleTreatmentType = useCallback((treatmentTypeId: string) => {
    setTreatmentTypeIds((current) => {
      if (current.includes(treatmentTypeId)) {
        return current.filter((id) => id !== treatmentTypeId);
      }

      return [...current, treatmentTypeId];
    });
  }, []);

  const handleSubmit = useCallback(() => {
    if (!patientId) {
      toast.error(APPOINTMENT_CREATE_COPY.validation.patientRequired);

      return;
    }

    if (!employeeId) {
      toast.error(APPOINTMENT_CREATE_COPY.validation.employeeRequired);

      return;
    }

    if (!clinicId) {
      toast.error(APPOINTMENT_CREATE_COPY.validation.clinicRequired);

      return;
    }

    mutate(
      {
        clinicId,

        patientId,

        employeeId,

        startsAt,

        treatmentTypeIds,

        notes: notes.trim() || null,
      },

      {
        onSuccess: () => {
          toast.success(APPOINTMENT_CREATE_COPY.success);

          reset();

          onSuccess();
        },

        onError: (cause) => {
          toast.error(cause.message || APPOINTMENT_CREATE_COPY.error);
        },
      },
    );
  }, [
    clinicId,

    employeeId,

    mutate,

    notes,

    onSuccess,

    patientId,

    reset,

    startsAt,

    treatmentTypeIds,
  ]);

  return {
    patientId,

    setPatientId,

    patientSearch,

    setPatientSearch,

    employeeId,

    setEmployeeId,

    startsAt,

    setStartsAt,

    treatmentTypeIds,

    toggleTreatmentType,

    notes,

    setNotes,

    patients: patientsForPicker,

    patientsLoading: patients.isLoading,

    employees: activeEmployees,

    employeesLoading: employees.isLoading,

    treatmentTypes: treatmentTypes.data ?? [],

    treatmentTypesLoading: treatmentTypes.isLoading,

    isPending,

    reset,

    handleSubmit,
  };
}
