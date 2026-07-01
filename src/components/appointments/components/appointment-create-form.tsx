import {
  Controller,
  type Control,
  type FieldErrors,
  type UseFormRegister,
} from "react-hook-form";

import NewAppointmentDatetimeField from "@/components/appointments/new-appointment-datetime-field";
import AppSearchableCombobox from "@/components/ui/app-searchable-combobox";
import AppSearchableMultiSelect from "@/components/ui/app-searchable-multi-select";
import { APPOINTMENT_CREATE_COPY } from "@/copy/appointment-create-copy";
import type { AppointmentFormValues } from "@/lib/hooks/use-appointment-create-dialog";
import type { Employee, Patient, TreatmentType } from "@/types/database.types";

const inputClassName =
  "w-full rounded-xl border border-border bg-surface px-3 py-2.5 text-sm outline-none ring-primary focus:ring-2";

type AppointmentCreateFormProps = {
  register: UseFormRegister<AppointmentFormValues>;
  control: Control<AppointmentFormValues>;
  errors: FieldErrors<AppointmentFormValues>;
  treatmentTypeIds: string[];
  onToggleTreatmentType: (treatmentTypeId: string) => void;
  onPatientSearchChange: (value: string) => void;
  patients: Patient[];
  patientsLoading: boolean;
  patientsSearching: boolean;
  employees: Employee[];
  employeesLoading: boolean;
  treatmentTypes: TreatmentType[];
  treatmentTypesLoading: boolean;
};

export default function AppointmentCreateForm({
  register,
  control,
  errors,
  treatmentTypeIds,
  onToggleTreatmentType,
  onPatientSearchChange,
  patients,
  patientsLoading,
  patientsSearching,
  employees,
  employeesLoading,
  treatmentTypes,
  treatmentTypesLoading,
}: AppointmentCreateFormProps) {
  const patientOptions = patients.map((patient) => ({
    value: patient.id,
    label: patient.full_name,
  }));

  const employeeOptions = employees.map((employee) => ({
    value: employee.id,
    label: employee.full_name,
    leading: (
      <span
        className={`h-2 w-2 shrink-0 rounded-full ${employee.color ? "" : "bg-border"}`}
        style={employee.color ? { backgroundColor: employee.color } : undefined}
      />
    ),
  }));

  const treatmentOptions = treatmentTypes.map((treatment) => ({
    id: treatment.id,
    label: treatment.name,
  }));

  return (
    <div className="mt-4 space-y-4">
      <label className="block space-y-1.5">
        <span className="text-sm text-ink-secondary">
          {APPOINTMENT_CREATE_COPY.fields.patient}{" "}
          <span className="text-danger">
            {APPOINTMENT_CREATE_COPY.fields.requiredMark}
          </span>
        </span>
        <Controller
          name="patientId"
          control={control}
          render={({ field }) => (
            <AppSearchableCombobox
              value={field.value || null}
              onValueChange={(value) => field.onChange(value ?? "")}
              options={patientOptions}
              placeholder={APPOINTMENT_CREATE_COPY.fields.selectPlaceholder}
              searchPlaceholder={APPOINTMENT_CREATE_COPY.fields.searchPatient}
              loading={patientsLoading}
              searching={patientsSearching}
              onSearchChange={onPatientSearchChange}
            />
          )}
        />
        {errors.patientId ? (
          <span className="text-sm text-danger">
            {errors.patientId.message}
          </span>
        ) : null}
      </label>
      <label className="block space-y-1.5">
        <span className="text-sm text-ink-secondary">
          {APPOINTMENT_CREATE_COPY.fields.employee}{" "}
          <span className="text-danger">
            {APPOINTMENT_CREATE_COPY.fields.requiredMark}
          </span>
        </span>
        <Controller
          name="employeeId"
          control={control}
          render={({ field }) => (
            <AppSearchableCombobox
              value={field.value || null}
              onValueChange={(value) => field.onChange(value ?? "")}
              options={employeeOptions}
              placeholder={APPOINTMENT_CREATE_COPY.fields.selectPlaceholder}
              searchPlaceholder={APPOINTMENT_CREATE_COPY.fields.searchEmployee}
              disabled={employeesLoading}
              loading={employeesLoading}
            />
          )}
        />
        {errors.employeeId ? (
          <span className="text-sm text-danger">
            {errors.employeeId.message}
          </span>
        ) : null}
      </label>
      <label className="block space-y-1.5">
        <span className="text-sm text-ink-secondary">
          {APPOINTMENT_CREATE_COPY.fields.startsAt}{" "}
          <span className="text-danger">
            {APPOINTMENT_CREATE_COPY.fields.requiredMark}
          </span>
        </span>
        <Controller
          name="startsAt"
          control={control}
          render={({ field }) => (
            <NewAppointmentDatetimeField
              value={field.value}
              onChange={field.onChange}
            />
          )}
        />
        {errors.startsAt ? (
          <span className="text-sm text-danger">{errors.startsAt.message}</span>
        ) : null}
      </label>
      <fieldset className="space-y-2">
        <legend className="text-sm text-ink-secondary">
          {APPOINTMENT_CREATE_COPY.fields.treatments}
        </legend>
        <AppSearchableMultiSelect
          selectedIds={treatmentTypeIds}
          onToggle={onToggleTreatmentType}
          options={treatmentOptions}
          loading={treatmentTypesLoading}
          emptyMessage={APPOINTMENT_CREATE_COPY.fields.noTreatments}
          searchPlaceholder={APPOINTMENT_CREATE_COPY.fields.searchTreatment}
        />
        {errors.treatmentTypeIds ? (
          <span className="text-sm text-danger">
            {errors.treatmentTypeIds.message}
          </span>
        ) : null}
      </fieldset>
      <label className="block space-y-1.5">
        <span className="text-sm text-ink-secondary">
          {APPOINTMENT_CREATE_COPY.fields.notes}
        </span>
        <textarea {...register("notes")} rows={3} className={inputClassName} />
        {errors.notes ? (
          <span className="text-sm text-danger">{errors.notes.message}</span>
        ) : null}
      </label>
    </div>
  );
}
