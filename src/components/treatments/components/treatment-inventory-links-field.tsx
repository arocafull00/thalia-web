import { Plus, Trash2 } from "lucide-react";
import {
  Controller,
  useFieldArray,
  type Control,
  type FieldErrors,
} from "react-hook-form";

import type { TreatmentFormValues } from "@/components/treatments/hooks/use-treatment-dialog";
import { TREATMENTS_COPY } from "@/components/treatments/treatments-copy";
import AppSearchableCombobox from "@/components/ui/app-searchable-combobox";
import { useInventoryItems } from "@/lib/hooks/use-inventory";

const inputClassName =
  "w-full rounded-xl border border-border bg-surface px-3 py-2.5 text-sm outline-none ring-primary focus:ring-2";

type TreatmentInventoryLinksFieldProps = {
  control: Control<TreatmentFormValues>;
  errors: FieldErrors<TreatmentFormValues>;
};

export default function TreatmentInventoryLinksField({
  control,
  errors,
}: TreatmentInventoryLinksFieldProps) {
  const inventory = useInventoryItems();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "inventoryLinks",
  });

  const inventoryOptions = (inventory.data ?? []).map((item) => ({
    value: item.id,
    label: item.unit ? `${item.name} (${item.unit})` : item.name,
  }));

  const selectedIds = fields.map(
    (field) => (field as { inventory_item_id: string }).inventory_item_id,
  );

  return (
    <fieldset className="space-y-3">
      <legend className="text-sm text-ink-secondary">
        {TREATMENTS_COPY.form.materials}
      </legend>
      <p className="text-sm text-ink-muted">
        {TREATMENTS_COPY.form.materialsHint}
      </p>
      {fields.length === 0 ? (
        <p className="text-sm text-ink-secondary">
          {TREATMENTS_COPY.row.noMaterials}
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
                  {TREATMENTS_COPY.form.material}
                </span>
                <Controller
                  name={`inventoryLinks.${index}.inventory_item_id`}
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
                      placeholder={TREATMENTS_COPY.form.selectMaterial}
                      searchPlaceholder={TREATMENTS_COPY.form.searchMaterial}
                      loading={inventory.isLoading}
                    />
                  )}
                />
                {errors.inventoryLinks?.[index]?.inventory_item_id ? (
                  <span className="text-sm text-danger">
                    {errors.inventoryLinks[index]?.inventory_item_id?.message}
                  </span>
                ) : null}
              </label>
              <label className="block space-y-1.5">
                <span className="text-sm text-ink-secondary">
                  {TREATMENTS_COPY.form.quantity}
                </span>
                <Controller
                  name={`inventoryLinks.${index}.quantity`}
                  control={control}
                  render={({ field: controllerField }) => (
                    <input
                      type="number"
                      min="0.01"
                      step="0.01"
                      value={controllerField.value}
                      onChange={(event) =>
                        controllerField.onChange(event.target.value)
                      }
                      className={inputClassName}
                    />
                  )}
                />
                {errors.inventoryLinks?.[index]?.quantity ? (
                  <span className="text-sm text-danger">
                    {errors.inventoryLinks[index]?.quantity?.message}
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
                  {TREATMENTS_COPY.form.removeMaterial}
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
        {TREATMENTS_COPY.form.addMaterial}
      </button>
    </fieldset>
  );
}
