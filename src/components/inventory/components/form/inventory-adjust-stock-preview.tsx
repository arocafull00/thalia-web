import { INVENTORY_ITEM_DETAIL_COPY } from "@/copy/inventory-item-detail-copy";
import type { InventoryMovementType } from "@/types/database.types";

type InventoryAdjustStockPreviewProps = {
  currentStock: number;
  resultingStock: number | null;
  unit: string | null;
  movementType: InventoryMovementType;
};

function formatStockValue(stock: number, unit: string | null) {
  const unitLabel = unit ?? "un.";

  return `${stock} ${unitLabel}`;
}

function resultingStockToneClass(
  movementType: InventoryMovementType,
  resultingStock: number | null,
) {
  if (resultingStock === null) {
    return "text-ink-secondary";
  }

  if (movementType === "out") {
    return "text-danger";
  }

  if (movementType === "in") {
    return "text-success";
  }

  return "text-ink";
}

export default function InventoryAdjustStockPreview({
  currentStock,
  resultingStock,
  unit,
  movementType,
}: InventoryAdjustStockPreviewProps) {
  return (
    <div className="rounded-xl border border-border-subtle bg-surface px-4 py-3">
      <dl className="grid gap-2 text-sm">
        <div className="flex items-center justify-between gap-4">
          <dt className="text-ink-secondary">
            {INVENTORY_ITEM_DETAIL_COPY.adjustStock.preview.currentStock}
          </dt>
          <dd className="font-medium text-ink">
            {formatStockValue(currentStock, unit)}
          </dd>
        </div>
        <div className="flex items-center justify-between gap-4">
          <dt className="text-ink-secondary">
            {INVENTORY_ITEM_DETAIL_COPY.adjustStock.preview.resultingStock}
          </dt>
          <dd
            className={`font-medium ${resultingStockToneClass(movementType, resultingStock)}`}
          >
            {resultingStock === null
              ? "—"
              : formatStockValue(resultingStock, unit)}
          </dd>
        </div>
      </dl>
    </div>
  );
}
