import type { Control, FieldErrors, UseFormRegister } from "react-hook-form";

import TreatmentColorField from "@/components/treatments/components/treatment-color-field";
import TreatmentInventoryLinksField from "@/components/treatments/components/treatment-inventory-links-field";
import type { TreatmentFormValues } from "@/components/treatments/hooks/use-treatment-dialog";
import { TREATMENTS_COPY } from "@/components/treatments/treatments-copy";

const inputClassName =
  "w-full rounded-xl border border-border bg-surface px-3 py-2.5 text-sm outline-none ring-primary focus:ring-2";

type TreatmentFormProps = {
  register: UseFormRegister<TreatmentFormValues>;
  control: Control<TreatmentFormValues>;
  errors: FieldErrors<TreatmentFormValues>;
};

export default function TreatmentForm({
  register,
  control,
  errors,
}: TreatmentFormProps) {
  return (
    <div className="mt-4 space-y-4">
      <label className="block space-y-1.5">
        <span className="text-sm text-ink-secondary">
          {TREATMENTS_COPY.form.name}{" "}
          <span className="text-danger">
            {TREATMENTS_COPY.form.requiredMark}
          </span>
        </span>
        <input {...register("name")} className={inputClassName} />
        {errors.name ? (
          <span className="text-sm text-danger">{errors.name.message}</span>
        ) : null}
      </label>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block space-y-1.5">
          <span className="text-sm text-ink-secondary">
            {TREATMENTS_COPY.form.category}
          </span>
          <input {...register("category")} className={inputClassName} />
          {errors.category ? (
            <span className="text-sm text-danger">
              {errors.category.message}
            </span>
          ) : null}
        </label>
        <label className="block space-y-1.5">
          <span className="text-sm text-ink-secondary">
            {TREATMENTS_COPY.form.duration}
          </span>
          <input
            {...register("duration_minutes")}
            type="number"
            min="1"
            className={inputClassName}
          />
          {errors.duration_minutes ? (
            <span className="text-sm text-danger">
              {errors.duration_minutes.message}
            </span>
          ) : null}
        </label>
      </div>
      <label className="block space-y-1.5">
        <span className="text-sm text-ink-secondary">
          {TREATMENTS_COPY.form.price}
        </span>
        <input
          {...register("price")}
          type="number"
          min="0"
          step="0.01"
          className={inputClassName}
        />
        {errors.price ? (
          <span className="text-sm text-danger">{errors.price.message}</span>
        ) : null}
      </label>
      <TreatmentColorField control={control} />
      <TreatmentInventoryLinksField control={control} errors={errors} />
    </div>
  );
}
