import NewAppointmentDatetimeField from "@/components/appointments/new-appointment-datetime-field";
import AppSearchableCombobox from "@/components/ui/app-searchable-combobox";
import AppSearchableMultiSelect from "@/components/ui/app-searchable-multi-select";
import { APPOINTMENT_CREATE_COPY } from "@/copy/appointment-create-copy";
import type { Employee, Patient, TreatmentType } from "@/types/database.types";

const inputClassName =
  "w-full rounded-xl border border-border bg-surface px-3 py-2.5 text-sm outline-none ring-primary focus:ring-2";

type AppointmentCreateFormProps = {
  patientId: string;
  onPatientIdChange: (value: string) => void;
  onPatientSearchChange: (value: string) => void;
  employeeId: string;
  onEmployeeIdChange: (value: string) => void;
  startsAt: Date;
  onStartsAtChange: (value: Date) => void;
  treatmentTypeIds: string[];
  onToggleTreatmentType: (treatmentTypeId: string) => void;
  notes: string;
  onNotesChange: (value: string) => void;
  patients: Patient[];
  patientsLoading: boolean;
  employees: Employee[];
  employeesLoading: boolean;
  treatmentTypes: TreatmentType[];
  treatmentTypesLoading: boolean;
};

export default function AppointmentCreateForm({
  patientId,
  onPatientIdChange,
  onPatientSearchChange,
  employeeId,
  onEmployeeIdChange,
  startsAt,
  onStartsAtChange,
  treatmentTypeIds,
  onToggleTreatmentType,
  notes,
  onNotesChange,
  patients,
  patientsLoading,
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
        <AppSearchableCombobox
          value={patientId || null}
          onValueChange={(value) => onPatientIdChange(value ?? "")}
          options={patientOptions}
          placeholder={APPOINTMENT_CREATE_COPY.fields.selectPlaceholder}
          searchPlaceholder={APPOINTMENT_CREATE_COPY.fields.searchPatient}
          disabled={patientsLoading}
          loading={patientsLoading}
          onSearchChange={onPatientSearchChange}
        />
      </label>
      <label className="block space-y-1.5">
        <span className="text-sm text-ink-secondary">
          {APPOINTMENT_CREATE_COPY.fields.employee}{" "}
          <span className="text-danger">
            {APPOINTMENT_CREATE_COPY.fields.requiredMark}
          </span>
        </span>
        <AppSearchableCombobox
          value={employeeId || null}
          onValueChange={(value) => onEmployeeIdChange(value ?? "")}
          options={employeeOptions}
          placeholder={APPOINTMENT_CREATE_COPY.fields.selectPlaceholder}
          searchPlaceholder={APPOINTMENT_CREATE_COPY.fields.searchEmployee}
          disabled={employeesLoading}
          loading={employeesLoading}
        />
      </label>
      <label className="block space-y-1.5">
        <span className="text-sm text-ink-secondary">
          {APPOINTMENT_CREATE_COPY.fields.startsAt}{" "}
          <span className="text-danger">
            {APPOINTMENT_CREATE_COPY.fields.requiredMark}
          </span>
        </span>
        <NewAppointmentDatetimeField
          value={startsAt}
          onChange={onStartsAtChange}
        />
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
      </fieldset>
      <label className="block space-y-1.5">
        <span className="text-sm text-ink-secondary">
          {APPOINTMENT_CREATE_COPY.fields.notes}
        </span>
        <textarea
          value={notes}
          onChange={(event) => onNotesChange(event.target.value)}
          rows={3}
          className={inputClassName}
        />
      </label>
    </div>
  );
}
