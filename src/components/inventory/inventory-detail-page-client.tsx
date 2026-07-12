"use client";

import { TrendingUp } from "lucide-react";
import { notFound } from "next/navigation";
import { useState } from "react";

import InventoryDetailHeader from "@/components/inventory/components/inventory-detail-header";
import InventoryDetailTabBar from "@/components/inventory/components/inventory-detail-tab-bar";
import InventoryDetailTabContent from "@/components/inventory/components/inventory-detail-tab-content";
import InventoryItemAdjustStockDialog from "@/components/inventory/components/inventory-item-adjust-stock-dialog";
import { getInventoryDetailActions } from "@/components/inventory/inventory-detail-actions";
import { BackButton } from "@/components/ui/primitives/back-button";
import { Notice } from "@/components/ui/primitives/notice";
import { SkeletonList } from "@/components/ui/primitives/skeleton-list";
import { INVENTORY_ITEM_DETAIL_COPY } from "@/copy/inventory-item-detail-copy";
import {
  useInventoryItem,
  useInventoryMovements,
} from "@/lib/hooks/use-inventory";
import { useInventoryDetailTabs } from "@/lib/hooks/use-inventory-detail-tabs";
import { useTopbarActions } from "@/lib/hooks/use-topbar-actions";
import { useTopbarBreadcrumb } from "@/lib/hooks/use-topbar-breadcrumb";
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
  const { activeTab, setActiveTab } = useInventoryDetailTabs();
  const [adjustDialogOpen, setAdjustDialogOpen] = useState(false);

  const refetch = () => {
    void fetchInventoryItem(itemId);
    void fetchInventoryMovements(itemId);
  };

  const item = itemQuery.data;

  useTopbarBreadcrumb(
    item
      ? {
          rootLabel: INVENTORY_ITEM_DETAIL_COPY.breadcrumbRoot,
          rootHref: "/inventory",
          currentLabel: item.name,
        }
      : null,
  );

  useTopbarActions(
    item
      ? {
          buttons: [
            {
              title: INVENTORY_ITEM_DETAIL_COPY.actions.adjustStock,
              icon: TrendingUp,
              onClick: () => setAdjustDialogOpen(true),
            },
          ],
          menu: {
            actions: getInventoryDetailActions({
              onAdjustStock: () => setAdjustDialogOpen(true),
            }),
            ariaLabel: INVENTORY_ITEM_DETAIL_COPY.moreActions,
          },
        }
      : null,
  );

  if (itemQuery.isLoading) {
    return (
      <div className="p-8" aria-busy="true">
        <SkeletonList />
      </div>
    );
  }

  if (itemQuery.error) {
    return (
      <div className="flex min-h-0 flex-1 flex-col space-y-6 overflow-y-auto p-8">
        <BackButton
          fallbackHref="/inventory"
          label={INVENTORY_ITEM_DETAIL_COPY.back}
        />
        <Notice
          tone="danger"
          message={INVENTORY_ITEM_DETAIL_COPY.errors.load}
        />
      </div>
    );
  }

  if (!item) {
    notFound();
  }

  const movements = movementsQuery.data ?? [];

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-y-auto">
      <InventoryDetailHeader item={item} />

      <div className="flex flex-col gap-6 px-4 pb-8 lg:px-8">
        <InventoryDetailTabBar
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
        <div role="tabpanel">
          <InventoryDetailTabContent
            activeTab={activeTab}
            item={item}
            movements={movements}
            movementsLoading={movementsQuery.isLoading}
            movementsError={movementsQuery.error}
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
