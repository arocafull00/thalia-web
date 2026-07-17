import SettingsDetailTabButton from "@/components/settings/components/settings-detail-tab-button";
import { SETTINGS_COPY } from "@/copy/settings-copy";
import type { SettingsTabId } from "@/lib/hooks/use-settings-tabs";

const SETTINGS_TAB_ITEMS: ReadonlyArray<{
  id: SettingsTabId;
  label: string;
}> = [
  { id: "summary", label: SETTINGS_COPY.tabs.summary },
  { id: "account", label: SETTINGS_COPY.tabs.account },
  { id: "app", label: SETTINGS_COPY.tabs.app },
  { id: "whatsapp", label: SETTINGS_COPY.tabs.whatsapp },
];

type SettingsDetailTabBarProps = {
  activeTab: SettingsTabId;
  onTabChange: (tabId: SettingsTabId) => void;
};

export default function SettingsDetailTabBar({
  activeTab,
  onTabChange,
}: SettingsDetailTabBarProps) {
  return (
    <nav
      role="tablist"
      aria-label={SETTINGS_COPY.page.title}
      className="shrink-0 border-b border-border-subtle bg-surface"
    >
      <div className="flex gap-2 overflow-x-auto px-4">
        {SETTINGS_TAB_ITEMS.map((tab) => (
          <SettingsDetailTabButton
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
