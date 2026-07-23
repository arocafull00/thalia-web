import type { Control, FieldErrors, UseFormRegister } from "react-hook-form";
import { Controller } from "react-hook-form";

import { CLINIC_HOURS_COPY } from "@/copy/clinic-hours-copy";
import type { ClinicHoursFormValues } from "@/lib/hooks/use-clinic-hours-dialog";

const inputClassName =
  "w-full rounded-xl border border-border bg-surface px-3 py-2.5 text-sm outline-none ring-primary focus:ring-2";

type ClinicHoursFormProps = {
  register: UseFormRegister<ClinicHoursFormValues>;
  control: Control<ClinicHoursFormValues>;
  errors: FieldErrors<ClinicHoursFormValues>;
};

export default function ClinicHoursForm({
  register,
  control,
  errors,
}: ClinicHoursFormProps) {
  return (
    <div className="mt-4 space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block space-y-1.5">
          <span className="text-sm text-ink-secondary">
            {CLINIC_HOURS_COPY.fields.openingTime}
          </span>
          <input
            type="time"
            {...register("opening_time")}
            className={inputClassName}
          />
          {errors.opening_time ? (
            <span className="text-sm text-danger">
              {errors.opening_time.message}
            </span>
          ) : null}
        </label>

        <label className="block space-y-1.5">
          <span className="text-sm text-ink-secondary">
            {CLINIC_HOURS_COPY.fields.closingTime}
          </span>
          <input
            type="time"
            {...register("closing_time")}
            className={inputClassName}
          />
          {errors.closing_time ? (
            <span className="text-sm text-danger">
              {errors.closing_time.message}
            </span>
          ) : null}
        </label>
      </div>

      <div className="space-y-1.5">
        <p className="text-sm text-ink-secondary">
          {CLINIC_HOURS_COPY.fields.openDays}
        </p>
        <Controller
          name="open_days"
          control={control}
          render={({ field }) => (
            <div className="flex flex-wrap gap-2">
              {CLINIC_HOURS_COPY.days.map((label, index) => {
                const day = index + 1;
                const isActive = (field.value as number[]).includes(day);
                return (
                  <button
                    key={day}
                    type="button"
                    onClick={() => {
                      const current = field.value as number[];
                      const next = isActive
                        ? current.filter((d) => d !== day)
                        : [...current, day].sort((a, b) => a - b);
                      field.onChange(next);
                    }}
                    className={`h-9 w-9 rounded-full text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-primary text-on-primary"
                        : "border border-border bg-surface text-ink-secondary hover:bg-canvas"
                    }`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          )}
        />
        {errors.open_days ? (
          <span className="text-sm text-danger">
            {errors.open_days.message}
          </span>
        ) : null}
      </div>

      <label className="block space-y-1.5">
        <span className="text-sm text-ink-secondary">
          {CLINIC_HOURS_COPY.fields.timezone}
        </span>
        <select {...register("timezone")} className={inputClassName}>
          {CLINIC_HOURS_COPY.timezones.map((tz) => (
            <option key={tz.value} value={tz.value}>
              {tz.label}
            </option>
          ))}
        </select>
        {errors.timezone ? (
          <span className="text-sm text-danger">{errors.timezone.message}</span>
        ) : null}
      </label>
    </div>
  );
}
