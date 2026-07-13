import { EMPLOYEE_DETAIL_COPY } from "@/copy/employee-detail-copy";
import type { EmployeeDetailTabId } from "@/lib/hooks/use-employee-detail-tabs";

import EmployeeDetailTabButton from "./employee-detail-tab-button";

const EMPLOYEE_DETAIL_TAB_ITEMS: ReadonlyArray<{
  id: EmployeeDetailTabId;
  label: string;
}> = [
  { id: "summary", label: EMPLOYEE_DETAIL_COPY.tabs.summary },
  { id: "appointments", label: EMPLOYEE_DETAIL_COPY.tabs.appointments },
];

type EmployeeDetailTabBarProps = {
  activeTab: EmployeeDetailTabId;
  onTabChange: (tabId: EmployeeDetailTabId) => void;
};

export default function EmployeeDetailTabBar({
  activeTab,
  onTabChange,
}: EmployeeDetailTabBarProps) {
  return (
    <nav
      role="tablist"
      aria-label={EMPLOYEE_DETAIL_COPY.breadcrumbRoot}
      className="shrink-0 border-b border-border-subtle bg-surface"
    >
      <div className="flex gap-2 overflow-x-auto px-4">
        {EMPLOYEE_DETAIL_TAB_ITEMS.map((tab) => (
          <EmployeeDetailTabButton
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
