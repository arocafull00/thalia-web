"use client";

import { useState } from "react";

export type PatientDetailTabId =
  "summary" | "clinical-history" | "treatments" | "appointments";

export function usePatientDetailTabs() {
  const [activeTab, setActiveTab] = useState<PatientDetailTabId>("summary");

  return { activeTab, setActiveTab };
}
