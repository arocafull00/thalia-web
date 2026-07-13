"use client";

import {
  Boxes,
  CircleDollarSign,
  Pencil,
  ShieldAlert,
  Trash2,
  TrendingUp,
} from "lucide-react";
import { toast } from "react-toastify";

import { ProfileInfoRow } from "@/components/ui/profile/profile-info-row";
import ProfileQuickActionButton from "@/components/ui/profile/profile-quick-action-button";
import { INVENTORY_ITEM_DETAIL_COPY } from "@/copy/inventory-item-detail-copy";
import { formatCurrency } from "@/lib/format";
import {
  getInventoryStockLevel,
  inventoryStockLevelLabel,
} from "@/lib/inventory-stock";
import type { InventoryItem } from "@/types/database.types";

type InventoryItemSidebarProps = {
  item: InventoryItem;
  onAdjustStock: () => void;
};

function inventoryStockLevelToneClass(
  level: ReturnType<typeof getInventoryStockLevel>,
) {
  if (level === "critical") {
    return "text-danger";
  }

  if (level === "low") {
    return "text-warning";
  }

  return "text-success";
}

function showComingSoon() {
  toast.info(INVENTORY_ITEM_DETAIL_COPY.actions.comingSoon);
}

export default function InventoryItemSidebar({
  item,
  onAdjustStock,
}: InventoryItemSidebarProps) {
  const stock = Number(item.stock ?? 0);
  const minStock = Number(item.min_stock ?? 0);
  const level = getInventoryStockLevel(stock, minStock);
  const unitPrice =
    item.unit_price === null ? "—" : formatCurrency(Number(item.unit_price));

  return (
    <aside className="order-1 flex h-full min-h-0 flex-col border-b border-border-subtle lg:order-1 lg:border-r lg:border-b-0">
      <div className="flex flex-col items-center gap-3 px-4 py-6 text-center lg:gap-4 lg:px-6 lg:py-8">
        <div className="flex size-14 shrink-0 items-center justify-center rounded-full bg-primary-subtle text-primary ring-2 ring-border ring-offset-2 lg:size-20">
          <Boxes className="size-7 lg:size-9" aria-hidden="true" />
        </div>
        <div className="min-w-0 space-y-2">
          <h1 className="text-xl font-semibold text-ink text-wrap-balance">
            {item.name}
          </h1>
          <p className="text-sm text-ink-secondary">
            {item.category ?? "Sin categoría"}
            {item.unit ? ` · ${item.unit}` : null}
          </p>
        </div>
      </div>

      <div className="border-t border-border-subtle" />

      <div
        aria-label={INVENTORY_ITEM_DETAIL_COPY.sections.stats}
        className="min-h-0 flex-1 overflow-y-auto"
      >
        <div className="divide-y divide-border-subtle px-6 py-6">
          <ProfileInfoRow
            icon={Boxes}
            iconLabel={INVENTORY_ITEM_DETAIL_COPY.fields.stock}
            label={INVENTORY_ITEM_DETAIL_COPY.fields.stock}
            value={`${stock} ${item.unit ?? "un."}`}
          />
          <ProfileInfoRow
            icon={ShieldAlert}
            iconLabel={INVENTORY_ITEM_DETAIL_COPY.fields.minStock}
            label={INVENTORY_ITEM_DETAIL_COPY.fields.minStock}
            value={`${minStock} ${item.unit ?? "un."}`}
          />
          <ProfileInfoRow
            icon={TrendingUp}
            iconLabel={INVENTORY_ITEM_DETAIL_COPY.fields.level}
            label={INVENTORY_ITEM_DETAIL_COPY.fields.level}
          >
            <span className={inventoryStockLevelToneClass(level)}>
              {inventoryStockLevelLabel(level)}
            </span>
          </ProfileInfoRow>
          <ProfileInfoRow
            icon={CircleDollarSign}
            iconLabel={INVENTORY_ITEM_DETAIL_COPY.fields.unitPrice}
            label={INVENTORY_ITEM_DETAIL_COPY.fields.unitPrice}
            value={unitPrice}
          />
          <ProfileInfoRow
            icon={Boxes}
            iconLabel={INVENTORY_ITEM_DETAIL_COPY.fields.reference}
            label={INVENTORY_ITEM_DETAIL_COPY.fields.reference}
            value={item.id.slice(0, 8).toUpperCase()}
          />
        </div>
      </div>

      <div className="mt-auto hidden shrink-0 border-t border-border-subtle lg:block">
        <div className="flex flex-col gap-2 px-6 py-6">
          <ProfileQuickActionButton
            label={INVENTORY_ITEM_DETAIL_COPY.actions.adjustStock}
            icon={TrendingUp}
            onClick={onAdjustStock}
          />
          <ProfileQuickActionButton
            label={INVENTORY_ITEM_DETAIL_COPY.actions.edit}
            icon={Pencil}
            variant="ghost"
            onClick={showComingSoon}
          />
          <ProfileQuickActionButton
            label={INVENTORY_ITEM_DETAIL_COPY.actions.delete}
            icon={Trash2}
            variant="ghost"
            onClick={showComingSoon}
          />
        </div>
      </div>
    </aside>
  );
}
