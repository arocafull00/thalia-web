import {
  Controller,
  type Control,
  type FieldErrors,
  type UseFormRegister,
} from "react-hook-form";

import { EMPLOYEE_EDIT_COPY } from "@/copy/employee-edit-copy";
import type { EmployeeEditFormValues } from "@/lib/hooks/use-employee-edit-dialog";
import type { EmployeeRole } from "@/types/database.types";

const inputClassName =
  "w-full rounded-xl border border-border bg-surface px-3 py-2.5 text-sm outline-none ring-primary focus:ring-2";

const roleOptions: EmployeeRole[] = [
  "admin",
  "reception",
  "doctor",
  "auxiliary",
];

type EmployeeEditFormProps = {
  register: UseFormRegister<EmployeeEditFormValues>;
  control: Control<EmployeeEditFormValues>;
  errors: FieldErrors<EmployeeEditFormValues>;
};

export default function EmployeeEditForm({
  register,
  control,
  errors,
}: EmployeeEditFormProps) {
  return (
    <div className="mt-4 space-y-4">
      <label className="block space-y-1.5">
        <span className="text-sm text-ink-secondary">
          {EMPLOYEE_EDIT_COPY.fields.fullName}{" "}
          <span className="text-danger">
            {EMPLOYEE_EDIT_COPY.fields.requiredMark}
          </span>
        </span>
        <input {...register("full_name")} className={inputClassName} />
        {errors.full_name ? (
          <span className="text-sm text-danger">
            {errors.full_name.message}
          </span>
        ) : null}
      </label>
      <label className="block space-y-1.5">
        <span className="text-sm text-ink-secondary">
          {EMPLOYEE_EDIT_COPY.fields.role}{" "}
          <span className="text-danger">
            {EMPLOYEE_EDIT_COPY.fields.requiredMark}
          </span>
        </span>
        <Controller
          name="role"
          control={control}
          render={({ field }) => (
            <select
              value={field.value}
              onChange={(event) =>
                field.onChange(event.target.value as EmployeeRole)
              }
              className={inputClassName}
            >
              {roleOptions.map((option) => (
                <option key={option} value={option}>
                  {EMPLOYEE_EDIT_COPY.roles[option]}
                </option>
              ))}
            </select>
          )}
        />
        {errors.role ? (
          <span className="text-sm text-danger">{errors.role.message}</span>
        ) : null}
      </label>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block space-y-1.5">
          <span className="text-sm text-ink-secondary">
            {EMPLOYEE_EDIT_COPY.fields.specialty}
          </span>
          <input {...register("specialty")} className={inputClassName} />
          {errors.specialty ? (
            <span className="text-sm text-danger">
              {errors.specialty.message}
            </span>
          ) : null}
        </label>
        <label className="block space-y-1.5">
          <span className="text-sm text-ink-secondary">
            {EMPLOYEE_EDIT_COPY.fields.phone}
          </span>
          <input {...register("phone")} type="tel" className={inputClassName} />
          {errors.phone ? (
            <span className="text-sm text-danger">{errors.phone.message}</span>
          ) : null}
        </label>
      </div>
    </div>
  );
}
