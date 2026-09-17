import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { INVENTORY_ITEM_DETAIL_COPY } from "@/copy/inventory-item-detail-copy";
import type { InventoryDetailTabId } from "@/lib/hooks/use-inventory-detail-tabs";

const INVENTORY_DETAIL_TAB_ITEMS: ReadonlyArray<{
  id: InventoryDetailTabId;
  label: string;
}> = [
  { id: "summary", label: INVENTORY_ITEM_DETAIL_COPY.tabs.summary },
  { id: "movements", label: INVENTORY_ITEM_DETAIL_COPY.tabs.movements },
];

export default function InventoryDetailTabBar() {
  return (
    <TabsList
      variant="line"
      aria-label={INVENTORY_ITEM_DETAIL_COPY.breadcrumbRoot}
      className="no-scrollbar w-full shrink-0 justify-start overflow-x-auto border-b border-border-subtle bg-surface px-4"
    >
      {INVENTORY_DETAIL_TAB_ITEMS.map((tab) => (
        <TabsTrigger
          key={tab.id}
          value={tab.id}
          className="shrink-0 rounded-none px-4 py-3 text-[0.8rem] font-medium whitespace-nowrap"
        >
          {tab.label}
        </TabsTrigger>
      ))}
    </TabsList>
  );
}
