import type { FieldErrors, UseFormRegister } from "react-hook-form";

import { CLINIC_EDIT_COPY } from "@/copy/clinic-edit-copy";
import type { ClinicEditFormValues } from "@/lib/hooks/use-clinic-edit-dialog";

const inputClassName =
  "w-full rounded-xl border border-border-field bg-surface px-3 py-2.5 text-sm outline-none ring-primary focus:ring-2";

type ClinicEditFormProps = {
  register: UseFormRegister<ClinicEditFormValues>;
  errors: FieldErrors<ClinicEditFormValues>;
};

export default function ClinicEditForm({
  register,
  errors,
}: ClinicEditFormProps) {
  return (
    <div className="mt-4 space-y-4">
      <label className="block space-y-1.5">
        <span className="text-sm text-ink-secondary">
          {CLINIC_EDIT_COPY.fields.name}{" "}
          <span className="text-danger">
            {CLINIC_EDIT_COPY.fields.requiredMark}
          </span>
        </span>
        <input {...register("name")} className={inputClassName} />
        {errors.name ? (
          <span className="text-sm text-danger">{errors.name.message}</span>
        ) : null}
      </label>

      <label className="block space-y-1.5">
        <span className="text-sm text-ink-secondary">
          {CLINIC_EDIT_COPY.fields.specialty}
        </span>
        <input {...register("specialty")} className={inputClassName} />
        {errors.specialty ? (
          <span className="text-sm text-danger">
            {errors.specialty.message}
          </span>
        ) : null}
      </label>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block space-y-1.5">
          <span className="text-sm text-ink-secondary">
            {CLINIC_EDIT_COPY.fields.phone}
          </span>
          <input {...register("phone")} type="tel" className={inputClassName} />
          {errors.phone ? (
            <span className="text-sm text-danger">{errors.phone.message}</span>
          ) : null}
        </label>

        <label className="block space-y-1.5">
          <span className="text-sm text-ink-secondary">
            {CLINIC_EDIT_COPY.fields.address}
          </span>
          <input {...register("address")} className={inputClassName} />
          {errors.address ? (
            <span className="text-sm text-danger">
              {errors.address.message}
            </span>
          ) : null}
        </label>
      </div>
    </div>
  );
}
