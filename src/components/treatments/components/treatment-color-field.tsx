import { Controller, type Control } from "react-hook-form";

import type { TreatmentFormValues } from "@/components/treatments/hooks/use-treatment-dialog";
import {
  TREATMENT_COLOR_PRESETS,
  TREATMENTS_COPY,
} from "@/components/treatments/treatments-copy";
import { cn } from "@/lib/utils";

type TreatmentColorFieldProps = {
  control: Control<TreatmentFormValues>;
};

export default function TreatmentColorField({
  control,
}: TreatmentColorFieldProps) {
  return (
    <fieldset className="space-y-3">
      <legend className="text-sm text-ink-secondary">
        {TREATMENTS_COPY.form.color}
      </legend>
      <Controller
        name="color"
        control={control}
        render={({ field }) => (
          <div className="flex flex-wrap items-center gap-2">
            {TREATMENT_COLOR_PRESETS.map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => field.onChange(preset)}
                className={cn(
                  "size-8 rounded-full border-2 transition-transform hover:scale-110",
                  field.value === preset
                    ? "border-ink ring-2 ring-primary"
                    : "border-border",
                )}
                style={{ backgroundColor: preset }}
                aria-label={preset}
              />
            ))}
            <label className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-border px-3 py-1.5 text-xs text-ink-secondary hover:bg-canvas">
              <input
                type="color"
                value={field.value ?? "#6366f1"}
                onChange={(event) => field.onChange(event.target.value)}
                className="size-5 cursor-pointer rounded border-0 bg-transparent p-0"
              />
              Personalizado
            </label>
            {field.value ? (
              <button
                type="button"
                onClick={() => field.onChange(null)}
                className="rounded-full px-3 py-1.5 text-xs text-ink-secondary hover:bg-canvas"
              >
                Quitar
              </button>
            ) : null}
          </div>
        )}
      />
    </fieldset>
  );
}
