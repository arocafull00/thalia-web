import { INVENTORY_ITEM_CREATE_COPY } from "@/copy/inventory-item-create-copy";

const inputClassName =
  "w-full rounded-xl border border-border bg-surface px-3 py-2.5 text-sm outline-none ring-primary focus:ring-2";

type InventoryItemCreateFormProps = {
  name: string;
  onNameChange: (value: string) => void;
  category: string;
  onCategoryChange: (value: string) => void;
  unit: string;
  onUnitChange: (value: string) => void;
  stock: string;
  onStockChange: (value: string) => void;
  minStock: string;
  onMinStockChange: (value: string) => void;
  unitPrice: string;
  onUnitPriceChange: (value: string) => void;
};

export default function InventoryItemCreateForm({
  name,
  onNameChange,
  category,
  onCategoryChange,
  unit,
  onUnitChange,
  stock,
  onStockChange,
  minStock,
  onMinStockChange,
  unitPrice,
  onUnitPriceChange,
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
        <input
          value={name}
          onChange={(event) => onNameChange(event.target.value)}
          className={inputClassName}
        />
      </label>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block space-y-1.5">
          <span className="text-sm text-ink-secondary">
            {INVENTORY_ITEM_CREATE_COPY.fields.category}
          </span>
          <input
            value={category}
            onChange={(event) => onCategoryChange(event.target.value)}
            className={inputClassName}
          />
        </label>
        <label className="block space-y-1.5">
          <span className="text-sm text-ink-secondary">
            {INVENTORY_ITEM_CREATE_COPY.fields.unit}
          </span>
          <input
            value={unit}
            onChange={(event) => onUnitChange(event.target.value)}
            className={inputClassName}
          />
        </label>
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        <label className="block space-y-1.5">
          <span className="text-sm text-ink-secondary">
            {INVENTORY_ITEM_CREATE_COPY.fields.stock}
          </span>
          <input
            value={stock}
            onChange={(event) => onStockChange(event.target.value)}
            type="number"
            min="0"
            className={inputClassName}
          />
        </label>
        <label className="block space-y-1.5">
          <span className="text-sm text-ink-secondary">
            {INVENTORY_ITEM_CREATE_COPY.fields.minStock}
          </span>
          <input
            value={minStock}
            onChange={(event) => onMinStockChange(event.target.value)}
            type="number"
            min="0"
            className={inputClassName}
          />
        </label>
        <label className="block space-y-1.5">
          <span className="text-sm text-ink-secondary">
            {INVENTORY_ITEM_CREATE_COPY.fields.unitPrice}
          </span>
          <input
            value={unitPrice}
            onChange={(event) => onUnitPriceChange(event.target.value)}
            type="number"
            min="0"
            step="0.01"
            className={inputClassName}
          />
        </label>
      </div>
    </div>
  );
}
