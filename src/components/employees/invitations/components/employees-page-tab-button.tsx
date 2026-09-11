"use client";

import type { EmployeesPageTab } from "@/components/employees/invitations/components/employees-page-tabs";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type EmployeesPageTabButtonProps = {
  id: EmployeesPageTab;
  label: string;
  isActive: boolean;
  onTabChange: (tab: EmployeesPageTab) => void;
};

export default function EmployeesPageTabButton({
  id,
  label,
  isActive,
  onTabChange,
}: EmployeesPageTabButtonProps) {
  return (
    <Button
      type="button"
      variant="ghost"
      role="tab"
      aria-selected={isActive}
      onClick={() => onTabChange(id)}
      className={cn(
        "relative shrink-0 rounded-none px-4 py-3 text-[0.8rem] font-medium whitespace-nowrap",
        isActive
          ? "text-primary after:absolute after:inset-x-0 after:bottom-0 after:h-[1.5px] after:bg-primary"
          : "text-ink-muted hover:text-ink-secondary",
      )}
    >
      {label}
    </Button>
  );
}
