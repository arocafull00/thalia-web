import { Controller, type Control } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
  EMPLOYEE_COLOR_PRESETS,
  EMPLOYEE_EDIT_COPY,
} from "@/copy/employee-edit-copy";
import type { EmployeeEditFormValues } from "@/lib/hooks/use-employee-edit-dialog";
import { cn } from "@/lib/utils";

type EmployeeColorFieldProps = {
  control: Control<EmployeeEditFormValues>;
};

export default function EmployeeColorField({
  control,
}: EmployeeColorFieldProps) {
  return (
    <fieldset className="space-y-3">
      <legend className="text-sm text-ink-secondary">
        {EMPLOYEE_EDIT_COPY.fields.color}
      </legend>
      <Controller
        name="color"
        control={control}
        render={({ field }) => (
          <div className="flex flex-wrap items-center gap-2">
            {EMPLOYEE_COLOR_PRESETS.map((preset) => (
              <Button
                key={preset}
                type="button"
                variant="ghost"
                size="icon-sm"
                onClick={() => field.onChange(preset)}
                className={cn(
                  "size-8 rounded-full border-2 p-0 transition-transform hover:scale-110",
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
              {EMPLOYEE_EDIT_COPY.color.custom}
            </label>
            {field.value ? (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => field.onChange(null)}
                className="rounded-full px-3 py-1.5 text-xs"
              >
                {EMPLOYEE_EDIT_COPY.color.remove}
              </Button>
            ) : null}
          </div>
        )}
      />
    </fieldset>
  );
}
