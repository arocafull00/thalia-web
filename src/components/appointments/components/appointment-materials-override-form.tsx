import { Plus, Trash2 } from "lucide-react";
import {
  Controller,
  useFieldArray,
  useWatch,
  type Control,
  type FieldErrors,
} from "react-hook-form";

import AppSearchableCombobox from "@/components/ui/app-searchable-combobox";
import { Button } from "@/components/ui/button";
import { APPOINTMENT_DETAIL_COPY } from "@/copy/appointment-detail-copy";
import { useInventoryItems } from "@/lib/hooks/use-inventory";
import type { AppointmentMaterialsFormValues } from "@/lib/schemas/appointment-materials-schema";

const inputClassName =
  "w-full rounded-xl border border-border bg-surface px-3 py-2.5 text-sm outline-none ring-primary focus:ring-2";

function hasInsufficientStock(
  stock: number | null | undefined,
  quantity: unknown,
) {
  return (stock ?? 0) < Number(quantity ?? 0);
}

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
  const items = useWatch({ control, name: "items" }) ?? [];

  const inventoryOptions = (inventory.data ?? []).map((item) => ({
    value: item.id,
    label: item.unit ? `${item.name} (${item.unit})` : item.name,
  }));

  const selectedIds = fields.map(
    (field) => (field as { inventory_item_id: string }).inventory_item_id,
  );

  return (
    <div className="mt-4 min-w-0 space-y-3">
      {fields.length === 0 ? (
        <p className="text-sm text-ink-secondary">
          {APPOINTMENT_DETAIL_COPY.noMaterials}
        </p>
      ) : (
        <div className="space-y-3">
          {fields.map((field, index) => (
            <div
              key={field.id}
              className="grid min-w-0 gap-3 rounded-xl border border-border-subtle p-3 sm:grid-cols-[minmax(0,1fr)_120px_auto]"
            >
              <label className="block min-w-0 space-y-1.5">
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
                        min="1"
                        step="1"
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
                {hasInsufficientStock(
                  (inventory.data ?? []).find(
                    (item) => item.id === items[index]?.inventory_item_id,
                  )?.stock,
                  items[index]?.quantity,
                ) ? (
                  <span className="text-sm text-danger">
                    Stock insuficiente
                  </span>
                ) : null}
              </label>
              <div className="flex items-start pt-7">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => remove(index)}
                  aria-label="Quitar material"
                  title="Quitar material"
                  className="rounded-full shadow-float"
                >
                  <Trash2 aria-hidden="true" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
      <Button
        variant="ghost"
        type="button"
        onClick={() => append({ inventory_item_id: "", quantity: 1 })}
        className="inline-flex items-center gap-2 rounded-button border border-border/60 px-3 py-1.5 text-sm text-ink-secondary hover:bg-(--hover-overlay)"
      >
        <Plus className="size-3.5" aria-hidden="true" />
        Añadir material
      </Button>
    </div>
  );
}
