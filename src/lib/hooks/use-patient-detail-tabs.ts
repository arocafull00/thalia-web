"use client";

import { useState } from "react";

export type PatientDetailTabId = "gallery" | "files";

export function usePatientDetailTabs() {
  const [activeTab, setActiveTab] = useState<PatientDetailTabId>("gallery");

  return { activeTab, setActiveTab };
}
