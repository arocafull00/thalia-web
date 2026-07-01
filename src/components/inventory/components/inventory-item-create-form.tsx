import type { FieldErrors, UseFormRegister } from "react-hook-form";

import { INVENTORY_ITEM_CREATE_COPY } from "@/copy/inventory-item-create-copy";
import type { InventoryFormValues } from "@/lib/hooks/use-inventory-item-create-dialog";

const inputClassName =
  "w-full rounded-xl border border-border bg-surface px-3 py-2.5 text-sm outline-none ring-primary focus:ring-2";

type InventoryItemCreateFormProps = {
  register: UseFormRegister<InventoryFormValues>;
  errors: FieldErrors<InventoryFormValues>;
};

export default function InventoryItemCreateForm({
  register,
  errors,
}: InventoryItemCreateFormProps) {
  return (
    <div className="mt-4 space-y-4">
      <label className="block space-y-1.5">
        <span className="text-sm text-ink-secondary">
          {INVENTORY_ITEM_CREATE_COPY.fields.name}{" "}
          <span className="text-danger">
            {INVENTORY_ITEM_CREATE_COPY.fields.requiredMark}
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
            {INVENTORY_ITEM_CREATE_COPY.fields.category}
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
            {INVENTORY_ITEM_CREATE_COPY.fields.unit}
          </span>
          <input {...register("unit")} className={inputClassName} />
          {errors.unit ? (
            <span className="text-sm text-danger">{errors.unit.message}</span>
          ) : null}
        </label>
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        <label className="block space-y-1.5">
          <span className="text-sm text-ink-secondary">
            {INVENTORY_ITEM_CREATE_COPY.fields.stock}
          </span>
          <input
            {...register("stock")}
            type="number"
            min="0"
            className={inputClassName}
          />
          {errors.stock ? (
            <span className="text-sm text-danger">{errors.stock.message}</span>
          ) : null}
        </label>
        <label className="block space-y-1.5">
          <span className="text-sm text-ink-secondary">
            {INVENTORY_ITEM_CREATE_COPY.fields.minStock}
          </span>
          <input
            {...register("min_stock")}
            type="number"
            min="0"
            className={inputClassName}
          />
          {errors.min_stock ? (
            <span className="text-sm text-danger">
              {errors.min_stock.message}
            </span>
          ) : null}
        </label>
        <label className="block space-y-1.5">
          <span className="text-sm text-ink-secondary">
            {INVENTORY_ITEM_CREATE_COPY.fields.unitPrice}
          </span>
          <input
            {...register("unit_price")}
            type="number"
            min="0"
            step="0.01"
            className={inputClassName}
          />
          {errors.unit_price ? (
            <span className="text-sm text-danger">
              {errors.unit_price.message}
            </span>
          ) : null}
        </label>
      </div>
    </div>
  );
}
