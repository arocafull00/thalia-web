"use client";

import { useState } from "react";

export type SettingsTabId = "summary" | "account" | "app" | "whatsapp";

export function useSettingsTabs() {
  const [activeTab, setActiveTab] = useState<SettingsTabId>("summary");

  return { activeTab, setActiveTab };
}
