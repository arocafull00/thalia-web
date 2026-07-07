"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { useState } from "react";

import InventoryItemAdjustStockDialog from "@/components/inventory/components/inventory-item-adjust-stock-dialog";
import InventoryItemSidebar from "@/components/inventory/components/inventory-item-sidebar";
import InventoryMovementsList from "@/components/inventory/components/inventory-movements-list";
import { Notice } from "@/components/ui/primitives/notice";
import { SkeletonList } from "@/components/ui/primitives/skeleton-list";
import { INVENTORY_ITEM_DETAIL_COPY } from "@/copy/inventory-item-detail-copy";
import {
  useInventoryItem,
  useInventoryMovements,
} from "@/lib/hooks/use-inventory";
import { useInventoryStore } from "@/stores/inventory-store";

type InventoryDetailPageClientProps = {
  itemId: string;
};

export default function InventoryDetailPageClient({
  itemId,
}: InventoryDetailPageClientProps) {
  const itemQuery = useInventoryItem(itemId);
  const movementsQuery = useInventoryMovements(itemId);
  const fetchInventoryItem = useInventoryStore(
    (state) => state.fetchInventoryItem,
  );
  const fetchInventoryMovements = useInventoryStore(
    (state) => state.fetchInventoryMovements,
  );
  const [adjustDialogOpen, setAdjustDialogOpen] = useState(false);

  const refetch = () => {
    void fetchInventoryItem(itemId);
    void fetchInventoryMovements(itemId);
  };

  if (itemQuery.isLoading) {
    return (
      <div className="p-8" aria-busy="true">
        <SkeletonList />
      </div>
    );
  }

  if (itemQuery.error) {
    return (
      <div className="p-8">
        <Notice
          tone="danger"
          message={INVENTORY_ITEM_DETAIL_COPY.errors.load}
        />
      </div>
    );
  }

  const item = itemQuery.data;

  if (!item) {
    notFound();
  }

  const movements = movementsQuery.data ?? [];

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="flex shrink-0 items-center justify-between gap-4 px-4 pt-6 pb-4 lg:px-8">
        <Link
          href="/inventory"
          className="inline-flex items-center gap-1.5 text-sm text-ink-secondary hover:text-ink"
        >
          <ArrowLeft className="size-4" aria-hidden="true" />
          {INVENTORY_ITEM_DETAIL_COPY.back}
        </Link>
      </div>

      <div className="grid min-h-0 flex-1 grid-cols-1 lg:grid-cols-[20%_1fr]">
        <InventoryItemSidebar
          item={item}
          onAdjustStock={() => setAdjustDialogOpen(true)}
        />
        <div className="order-2 flex min-h-0 flex-1 flex-col overflow-y-auto px-4 py-6 lg:order-2 lg:px-6 lg:py-8">
          <InventoryMovementsList
            item={item}
            movements={movements}
            isLoading={movementsQuery.isLoading}
            error={movementsQuery.error}
          />
        </div>
      </div>

      <InventoryItemAdjustStockDialog
        itemId={item.id}
        open={adjustDialogOpen}
        onOpenChange={setAdjustDialogOpen}
        onSuccess={refetch}
      />
    </div>
  );
}
