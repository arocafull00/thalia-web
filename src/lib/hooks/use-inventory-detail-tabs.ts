"use client";

import { useState } from "react";

export type InventoryDetailTabId = "summary" | "movements";

export function useInventoryDetailTabs() {
  const [activeTab, setActiveTab] = useState<InventoryDetailTabId>("summary");

  return { activeTab, setActiveTab };
}
