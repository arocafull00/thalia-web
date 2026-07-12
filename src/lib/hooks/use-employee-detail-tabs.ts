"use client";

import { useState } from "react";

export type EmployeeDetailTabId = "summary" | "appointments";

export function useEmployeeDetailTabs() {
  const [activeTab, setActiveTab] = useState<EmployeeDetailTabId>("summary");

  return { activeTab, setActiveTab };
}
