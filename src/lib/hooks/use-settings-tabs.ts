"use client";

import { useState } from "react";

export type SettingsTabId = "usuario" | "clinica" | "aplicacion";

export function useSettingsTabs() {
  const [activeTab, setActiveTab] = useState<SettingsTabId>("usuario");

  return { activeTab, setActiveTab };
}
