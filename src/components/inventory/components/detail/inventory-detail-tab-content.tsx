import type { InventoryDetailTabId } from "@/lib/hooks/use-inventory-detail-tabs";
import type {
  InventoryItem,
  InventoryMovementWithEmployee,
} from "@/types/database.types";

import InventoryMovementsList from "../history/inventory-movements-list";

import InventoryItemSummary from "./inventory-item-summary";

type InventoryDetailTabContentProps = {
  activeTab: InventoryDetailTabId;
  item: InventoryItem;
  movements: InventoryMovementWithEmployee[];
  movementsLoading: boolean;
  movementsError: Error | null | undefined;
};

export default function InventoryDetailTabContent({
  activeTab,
  item,
  movements,
  movementsLoading,
  movementsError,
}: InventoryDetailTabContentProps) {
  if (activeTab === "summary") {
    return <InventoryItemSummary item={item} />;
  }

  return (
    <InventoryMovementsList
      item={item}
      movements={movements}
      isLoading={movementsLoading}
      error={movementsError}
    />
  );
}
