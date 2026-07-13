import { Boxes, CircleDollarSign, ShieldAlert, TrendingUp } from "lucide-react";

import { ProfileInfoRow } from "@/components/ui/profile/profile-info-row";
import { INVENTORY_ITEM_DETAIL_COPY } from "@/copy/inventory-item-detail-copy";
import { formatCurrency } from "@/lib/format";
import {
  getInventoryStockLevel,
  inventoryStockLevelLabel,
} from "@/lib/inventory-stock";
import type { InventoryItem } from "@/types/database.types";

type InventoryItemSummaryProps = {
  item: InventoryItem;
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

export default function InventoryItemSummary({
  item,
}: InventoryItemSummaryProps) {
  const stock = Number(item.stock ?? 0);
  const minStock = Number(item.min_stock ?? 0);
  const level = getInventoryStockLevel(stock, minStock);
  const unitPrice =
    item.unit_price === null ? "—" : formatCurrency(Number(item.unit_price));

  return (
    <section aria-labelledby="inventory-summary-heading">
      <h2
        id="inventory-summary-heading"
        className="border-b border-border-subtle pb-4 text-lg font-medium text-ink text-wrap-balance"
      >
        {INVENTORY_ITEM_DETAIL_COPY.sections.stats}
      </h2>
      <div className="divide-y divide-border-subtle pt-2">
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
    </section>
  );
}
