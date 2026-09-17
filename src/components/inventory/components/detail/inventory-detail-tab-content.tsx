import { TabsContent } from "@/components/ui/tabs";
import type {
  InventoryItem,
  InventoryMovementWithEmployee,
} from "@/types/database.types";

import InventoryMovementsList from "../history/inventory-movements-list";

import InventoryItemSummary from "./inventory-item-summary";

type InventoryDetailTabContentProps = {
  item: InventoryItem;
  movements: InventoryMovementWithEmployee[];
  movementsLoading: boolean;
  movementsError: Error | null | undefined;
};

export default function InventoryDetailTabContent({
  item,
  movements,
  movementsLoading,
  movementsError,
}: InventoryDetailTabContentProps) {
  return (
    <>
      <TabsContent value="summary">
        <InventoryItemSummary item={item} />
      </TabsContent>
      <TabsContent value="movements">
        <InventoryMovementsList
          item={item}
          movements={movements}
          isLoading={movementsLoading}
          error={movementsError}
        />
      </TabsContent>
    </>
  );
}
