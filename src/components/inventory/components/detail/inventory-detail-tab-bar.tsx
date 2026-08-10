import { INVENTORY_ITEM_DETAIL_COPY } from "@/copy/inventory-item-detail-copy";
import type { InventoryDetailTabId } from "@/lib/hooks/use-inventory-detail-tabs";

import InventoryDetailTabButton from "./inventory-detail-tab-button";

const INVENTORY_DETAIL_TAB_ITEMS: ReadonlyArray<{
  id: InventoryDetailTabId;
  label: string;
}> = [
  { id: "summary", label: INVENTORY_ITEM_DETAIL_COPY.tabs.summary },
  { id: "movements", label: INVENTORY_ITEM_DETAIL_COPY.tabs.movements },
];

type InventoryDetailTabBarProps = {
  activeTab: InventoryDetailTabId;
  onTabChange: (tabId: InventoryDetailTabId) => void;
};

export default function InventoryDetailTabBar({
  activeTab,
  onTabChange,
}: InventoryDetailTabBarProps) {
  return (
    <nav
      role="tablist"
      aria-label={INVENTORY_ITEM_DETAIL_COPY.breadcrumbRoot}
      className="shrink-0 border-b border-border-subtle bg-surface"
    >
      <div className="no-scrollbar flex gap-2 overflow-x-auto px-4">
        {INVENTORY_DETAIL_TAB_ITEMS.map((tab) => (
          <InventoryDetailTabButton
            key={tab.id}
            label={tab.label}
            isActive={activeTab === tab.id}
            onClick={() => onTabChange(tab.id)}
          />
        ))}
      </div>
    </nav>
  );
}
