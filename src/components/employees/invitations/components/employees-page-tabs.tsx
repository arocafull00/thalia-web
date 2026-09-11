"use client";

import EmployeesPageTabButton from "@/components/employees/invitations/components/employees-page-tab-button";
import { EMPLOYEE_INVITATIONS_COPY } from "@/copy/employee-invitations-copy";

export type EmployeesPageTab = "staff" | "invitations";

type EmployeesPageTabsProps = {
  activeTab: EmployeesPageTab;
  invitationCount: number;
  onTabChange: (tab: EmployeesPageTab) => void;
};

export default function EmployeesPageTabs({
  activeTab,
  invitationCount,
  onTabChange,
}: EmployeesPageTabsProps) {
  const items: Array<{ id: EmployeesPageTab; label: string }> = [
    { id: "staff", label: EMPLOYEE_INVITATIONS_COPY.tabs.staff },
    {
      id: "invitations",
      label: `${EMPLOYEE_INVITATIONS_COPY.tabs.invitations} (${invitationCount})`,
    },
  ];

  return (
    <nav
      role="tablist"
      aria-label={EMPLOYEE_INVITATIONS_COPY.tabs.ariaLabel}
      className="no-scrollbar flex shrink-0 gap-2 overflow-x-auto border-b border-border-subtle"
    >
      {items.map((item) => (
        <EmployeesPageTabButton
          key={item.id}
          id={item.id}
          label={item.label}
          isActive={item.id === activeTab}
          onTabChange={onTabChange}
        />
      ))}
    </nav>
  );
}
