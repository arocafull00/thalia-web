"use client";

import { Button } from "@/components/ui/button";
import { EMPLOYEE_INVITATIONS_COPY } from "@/copy/employee-invitations-copy";
import { cn } from "@/lib/utils";

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
      {items.map((item) => {
        const isActive = item.id === activeTab;

        return (
          <Button
            key={item.id}
            type="button"
            variant="ghost"
            role="tab"
            aria-selected={isActive}
            onClick={() => onTabChange(item.id)}
            className={cn(
              "relative shrink-0 rounded-none px-4 py-3 text-[0.8rem] font-medium whitespace-nowrap",
              isActive
                ? "text-primary after:absolute after:inset-x-0 after:bottom-0 after:h-[1.5px] after:bg-primary"
                : "text-ink-muted hover:text-ink-secondary",
            )}
          >
            {item.label}
          </Button>
        );
      })}
    </nav>
  );
}
