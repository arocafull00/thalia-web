import { Plus, Trash2 } from "lucide-react";
import {
  Controller,
  useFieldArray,
  type Control,
  type FieldErrors,
} from "react-hook-form";

import type { AppointmentMaterialsFormValues } from "@/components/appointments/hooks/use-appointment-materials-override-dialog";
import AppSearchableCombobox from "@/components/ui/app-searchable-combobox";
import { APPOINTMENT_DETAIL_COPY } from "@/copy/appointment-detail-copy";
import { useInventoryItems } from "@/lib/hooks/use-inventory";

const inputClassName =
  "w-full rounded-xl border border-border bg-surface px-3 py-2.5 text-sm outline-none ring-primary focus:ring-2";

type AppointmentMaterialsOverrideFormProps = {
  control: Control<AppointmentMaterialsFormValues>;
  errors: FieldErrors<AppointmentMaterialsFormValues>;
};

export default function AppointmentMaterialsOverrideForm({
  control,
  errors,
}: AppointmentMaterialsOverrideFormProps) {
  const inventory = useInventoryItems();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "items",
  });

  const inventoryOptions = (inventory.data ?? []).map((item) => ({
    value: item.id,
    label: item.unit ? `${item.name} (${item.unit})` : item.name,
  }));

  const selectedIds = fields.map(
    (field) => (field as { inventory_item_id: string }).inventory_item_id,
  );

  return (
    <div className="mt-4 space-y-3">
      {fields.length === 0 ? (
        <p className="text-sm text-ink-secondary">
          {APPOINTMENT_DETAIL_COPY.noMaterials}
        </p>
      ) : (
        <div className="space-y-3">
          {fields.map((field, index) => (
            <div
              key={field.id}
              className="grid gap-3 rounded-xl border border-border-subtle p-3 sm:grid-cols-[1fr_120px_auto]"
            >
              <label className="block space-y-1.5">
                <span className="text-sm text-ink-secondary">
                  {APPOINTMENT_DETAIL_COPY.materials}
                </span>
                <Controller
                  name={`items.${index}.inventory_item_id`}
                  control={control}
                  render={({ field: controllerField }) => (
                    <AppSearchableCombobox
                      value={controllerField.value || null}
                      onValueChange={(value) =>
                        controllerField.onChange(value ?? "")
                      }
                      options={inventoryOptions.filter(
                        (option) =>
                          option.value === controllerField.value ||
                          !selectedIds.includes(option.value),
                      )}
                      placeholder="Seleccionar material"
                      searchPlaceholder="Buscar material…"
                      loading={inventory.isLoading}
                    />
                  )}
                />
                {errors.items?.[index]?.inventory_item_id ? (
                  <span className="text-sm text-danger">
                    {errors.items[index]?.inventory_item_id?.message}
                  </span>
                ) : null}
              </label>
              <label className="block space-y-1.5">
                <span className="text-sm text-ink-secondary">Cantidad</span>
                <Controller
                  name={`items.${index}.quantity`}
                  control={control}
                  render={({ field: controllerField }) => {
                    const quantityValue =
                      typeof controllerField.value === "number" ||
                      typeof controllerField.value === "string"
                        ? controllerField.value
                        : "";

                    return (
                      <input
                        type="number"
                        min="0.01"
                        step="0.01"
                        value={quantityValue}
                        onChange={(event) =>
                          controllerField.onChange(event.target.value)
                        }
                        className={inputClassName}
                      />
                    );
                  }}
                />
                {errors.items?.[index]?.quantity ? (
                  <span className="text-sm text-danger">
                    {errors.items[index]?.quantity?.message}
                  </span>
                ) : null}
              </label>
              <div className="flex items-end">
                <button
                  type="button"
                  onClick={() => remove(index)}
                  className="inline-flex h-10 items-center gap-2 rounded-full border border-border px-3 text-xs font-medium uppercase tracking-wide text-ink-secondary hover:bg-canvas"
                >
                  <Trash2 className="size-3.5" aria-hidden="true" />
                  Quitar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      <button
        type="button"
        onClick={() => append({ inventory_item_id: "", quantity: 1 })}
        className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-xs font-medium uppercase tracking-wide text-ink-secondary hover:bg-canvas"
      >
        <Plus className="size-3.5" aria-hidden="true" />
        Añadir material
      </button>
    </div>
  );
}
