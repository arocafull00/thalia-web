import {
  Controller,
  type Control,
  type FieldErrors,
  type UseFormRegister,
} from "react-hook-form";

import AppointmentSlotPicker from "@/components/appointments/components/appointment-slot-picker";
import AppointmentSlotSearchControls from "@/components/appointments/components/appointment-slot-search-controls";
import NewAppointmentDatetimeField from "@/components/appointments/new-appointment-datetime-field";
import AppDialogError from "@/components/ui/app-dialog-error";
import AppSearchableCombobox from "@/components/ui/app-searchable-combobox";
import AppSearchableMultiSelect from "@/components/ui/app-searchable-multi-select";
import { Notice } from "@/components/ui/primitives/notice";
import { APPOINTMENT_CREATE_COPY } from "@/copy/appointment-create-copy";
import type { SlotSearchMode } from "@/lib/find-slots";
import type { AppointmentFormValues } from "@/lib/hooks/use-appointment-create-dialog";
import type { ClinicInfo } from "@/lib/hooks/use-clinic-info";
import type { Employee, Patient, Treatment } from "@/types/database.types";

const inputClassName =
  "w-full rounded-xl border border-border-field bg-surface px-3 py-2.5 text-sm outline-none ring-primary focus:ring-2";

/** El selector de paciente solo necesita id y nombre, así que acepta tanto un
 * paciente completo como el que viene embebido en la cita. */
export type AppointmentPatientOption = Pick<Patient, "id" | "full_name">;

type AppointmentCreateFormProps = {
  register: UseFormRegister<AppointmentFormValues>;
  control: Control<AppointmentFormValues>;
  errors: FieldErrors<AppointmentFormValues>;
  clinic?: ClinicInfo | null;
  treatmentIds: string[];
  onToggleTreatment: (treatmentId: string) => void;
  patients: AppointmentPatientOption[];
  patientsLoading: boolean;
  employees: Employee[];
  employeesLoading: boolean;
  treatments: Treatment[];
  treatmentsLoading: boolean;
  slotsOpen: boolean;
  slots: Date[];
  slotsLoading: boolean;
  slotSearchMode: SlotSearchMode;
  onSlotSearchModeChange: (mode: SlotSearchMode) => void;
  onOpenSlots: () => void;
  onCloseSlots: () => void;
  onSelectSlot: (date: Date) => void;
  onInvalidStartsAt: () => void;
  onValidStartsAt: () => void;
  showPastAppointmentWarning?: boolean;
};

export default function AppointmentCreateForm({
  register,
  control,
  errors,
  clinic,
  treatmentIds,
  onToggleTreatment,
  patients,
  patientsLoading,
  employees,
  employeesLoading,
  treatments,
  treatmentsLoading,
  slotsOpen,
  slots,
  slotsLoading,
  slotSearchMode,
  onSlotSearchModeChange,
  onOpenSlots,
  onCloseSlots,
  onSelectSlot,
  onInvalidStartsAt,
  onValidStartsAt,
  showPastAppointmentWarning = false,
}: AppointmentCreateFormProps) {
  const canFindSlots = treatmentIds.length > 0;

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

  const treatmentOptions = treatments.map((treatment) => ({
    id: treatment.id,
    label: treatment.name,
  }));

  return (
    <div className="mt-4 space-y-4">
      <AppDialogError message={errors.root?.message} />
      {showPastAppointmentWarning ? (
        <Notice
          tone="warning"
          message={APPOINTMENT_CREATE_COPY.pastAppointmentWarning}
        />
      ) : null}

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
              testId="appointment-patient-combobox"
              value={field.value || null}
              onValueChange={(value) => field.onChange(value ?? "")}
              options={patientOptions}
              placeholder={APPOINTMENT_CREATE_COPY.fields.selectPlaceholder}
              searchPlaceholder={APPOINTMENT_CREATE_COPY.fields.searchPatient}
              loading={patientsLoading}
            />
          )}
        />
        {errors.patientId ? (
          <span className="text-sm text-danger">
            {errors.patientId.message}
          </span>
        ) : null}
      </label>

      {/* Profesional */}
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
              testId="appointment-employee-combobox"
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

      {/* Tratamientos */}
      <fieldset className="space-y-2">
        <legend className="text-sm text-ink-secondary">
          {APPOINTMENT_CREATE_COPY.fields.treatments}
        </legend>
        <AppSearchableMultiSelect
          selectedIds={treatmentIds}
          onToggle={onToggleTreatment}
          options={treatmentOptions}
          loading={treatmentsLoading}
          emptyMessage={APPOINTMENT_CREATE_COPY.fields.noTreatments}
          searchPlaceholder={APPOINTMENT_CREATE_COPY.fields.searchTreatment}
        />
        {errors.treatmentIds ? (
          <span className="text-sm text-danger">
            {errors.treatmentIds.message}
          </span>
        ) : null}
      </fieldset>

      {/* Fecha y hora */}
      <div className="space-y-1.5">
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
              clinic={clinic}
              onInvalidTime={onInvalidStartsAt}
              onValidTime={onValidStartsAt}
            />
          )}
        />
        {errors.startsAt ? (
          <span className="text-sm text-danger">{errors.startsAt.message}</span>
        ) : null}
        <AppointmentSlotSearchControls
          mode={slotSearchMode}
          disabled={!canFindSlots}
          loading={slotsLoading}
          onModeChange={onSlotSearchModeChange}
          onSearch={onOpenSlots}
        />
        {slotsOpen ? (
          <AppointmentSlotPicker
            slots={slots}
            loading={slotsLoading}
            onSelect={onSelectSlot}
            onClose={onCloseSlots}
          />
        ) : null}
      </div>

      {/* Notas */}
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
