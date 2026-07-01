import {
  Controller,
  type Control,
  type FieldErrors,
  type UseFormRegister,
} from "react-hook-form";

import { EMPLOYEE_INVITE_COPY } from "@/copy/employee-invite-copy";
import type { EmployeeFormValues } from "@/lib/hooks/use-employee-invite-dialog";
import type { EmployeeRole } from "@/types/database.types";

const inputClassName =
  "w-full rounded-xl border border-border bg-surface px-3 py-2.5 text-sm outline-none ring-primary focus:ring-2";

const roleOptions: EmployeeRole[] = [
  "admin",
  "reception",
  "doctor",
  "auxiliary",
];

type EmployeeInviteFormProps = {
  register: UseFormRegister<EmployeeFormValues>;
  control: Control<EmployeeFormValues>;
  errors: FieldErrors<EmployeeFormValues>;
};

export default function EmployeeInviteForm({
  register,
  control,
  errors,
}: EmployeeInviteFormProps) {
  return (
    <div className="mt-4 space-y-4">
      <label className="block space-y-1.5">
        <span className="text-sm text-ink-secondary">
          {EMPLOYEE_INVITE_COPY.fields.fullName}{" "}
          <span className="text-danger">
            {EMPLOYEE_INVITE_COPY.fields.requiredMark}
          </span>
        </span>
        <input {...register("fullName")} className={inputClassName} />
        {errors.fullName ? (
          <span className="text-sm text-danger">{errors.fullName.message}</span>
        ) : null}
      </label>
      <label className="block space-y-1.5">
        <span className="text-sm text-ink-secondary">
          {EMPLOYEE_INVITE_COPY.fields.email}{" "}
          <span className="text-danger">
            {EMPLOYEE_INVITE_COPY.fields.requiredMark}
          </span>
        </span>
        <input {...register("email")} type="email" className={inputClassName} />
        {errors.email ? (
          <span className="text-sm text-danger">{errors.email.message}</span>
        ) : null}
      </label>
      <label className="block space-y-1.5">
        <span className="text-sm text-ink-secondary">
          {EMPLOYEE_INVITE_COPY.fields.role}{" "}
          <span className="text-danger">
            {EMPLOYEE_INVITE_COPY.fields.requiredMark}
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
                  {EMPLOYEE_INVITE_COPY.roles[option]}
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
            {EMPLOYEE_INVITE_COPY.fields.specialty}
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
            {EMPLOYEE_INVITE_COPY.fields.phone}
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
