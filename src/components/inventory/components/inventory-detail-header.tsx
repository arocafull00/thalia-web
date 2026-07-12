"use client";

import InventoryItemIconDisplay from "@/components/inventory/components/inventory-item-icon-display";
import {
  getInventoryStockLevel,
  inventoryStockLevelLabel,
} from "@/lib/inventory-stock";
import type { InventoryItem } from "@/types/database.types";

type InventoryDetailHeaderProps = {
  item: InventoryItem;
};

export default function InventoryDetailHeader({
  item,
}: InventoryDetailHeaderProps) {
  const stock = Number(item.stock ?? 0);
  const minStock = Number(item.min_stock ?? 0);
  const level = getInventoryStockLevel(stock, minStock);
  const subtitleParts = [
    item.category ?? "Sin categoría",
    item.unit,
    inventoryStockLevelLabel(level),
  ].filter(Boolean);

  return (
    <div className="flex shrink-0 items-center justify-between gap-4 px-4 pt-6 pb-6 lg:px-8">
      <div className="flex items-center gap-4">
        <InventoryItemIconDisplay />

        <div className="min-w-0 space-y-1">
          <h1 className="text-xl font-semibold text-ink">{item.name}</h1>
          {subtitleParts.length > 0 ? (
            <p className="text-sm text-ink-secondary">
              {subtitleParts.join(" · ")}
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
}
