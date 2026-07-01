import {
  Controller,
  type Control,
  type FieldErrors,
  type UseFormRegister,
} from "react-hook-form";

import NewPatientDateField from "@/components/patients/new-patient-date-field";
import { PATIENT_CREATE_COPY } from "@/copy/patient-create-copy";
import type { PatientFormValues } from "@/lib/hooks/use-patient-create-dialog";

const inputClassName =
  "w-full rounded-xl border border-border bg-surface px-3 py-2.5 text-sm outline-none ring-primary focus:ring-2";

type PatientCreateFormProps = {
  register: UseFormRegister<PatientFormValues>;
  control: Control<PatientFormValues>;
  errors: FieldErrors<PatientFormValues>;
};

export default function PatientCreateForm({
  register,
  control,
  errors,
}: PatientCreateFormProps) {
  return (
    <div className="mt-4 space-y-4">
      <label className="block space-y-1.5">
        <span className="text-sm text-ink-secondary">
          {PATIENT_CREATE_COPY.fields.fullName}{" "}
          <span className="text-danger">
            {PATIENT_CREATE_COPY.fields.requiredMark}
          </span>
        </span>
        <input {...register("full_name")} className={inputClassName} />
        {errors.full_name ? (
          <span className="text-sm text-danger">
            {errors.full_name.message}
          </span>
        ) : null}
      </label>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block space-y-1.5">
          <span className="text-sm text-ink-secondary">
            {PATIENT_CREATE_COPY.fields.phone}
          </span>
          <input {...register("phone")} type="tel" className={inputClassName} />
          {errors.phone ? (
            <span className="text-sm text-danger">{errors.phone.message}</span>
          ) : null}
        </label>
        <label className="block space-y-1.5">
          <span className="text-sm text-ink-secondary">
            {PATIENT_CREATE_COPY.fields.email}
          </span>
          <input
            {...register("email")}
            type="email"
            className={inputClassName}
          />
          {errors.email ? (
            <span className="text-sm text-danger">{errors.email.message}</span>
          ) : null}
        </label>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block space-y-1.5">
          <span className="text-sm text-ink-secondary">
            {PATIENT_CREATE_COPY.fields.dni}
          </span>
          <input {...register("dni")} className={inputClassName} />
          {errors.dni ? (
            <span className="text-sm text-danger">{errors.dni.message}</span>
          ) : null}
        </label>
        <label className="block space-y-1.5">
          <span className="text-sm text-ink-secondary">
            {PATIENT_CREATE_COPY.fields.birthDate}
          </span>
          <Controller
            name="birth_date"
            control={control}
            render={({ field }) => (
              <NewPatientDateField
                value={field.value}
                onChange={field.onChange}
              />
            )}
          />
          {errors.birth_date ? (
            <span className="text-sm text-danger">
              {errors.birth_date.message}
            </span>
          ) : null}
        </label>
      </div>
      <label className="block space-y-1.5">
        <span className="text-sm text-ink-secondary">
          {PATIENT_CREATE_COPY.fields.address}
        </span>
        <input {...register("address")} className={inputClassName} />
        {errors.address ? (
          <span className="text-sm text-danger">{errors.address.message}</span>
        ) : null}
      </label>
      <label className="block space-y-1.5">
        <span className="text-sm text-ink-secondary">
          {PATIENT_CREATE_COPY.fields.notes}
        </span>
        <textarea {...register("notes")} rows={3} className={inputClassName} />
        {errors.notes ? (
          <span className="text-sm text-danger">{errors.notes.message}</span>
        ) : null}
      </label>
    </div>
  );
}
