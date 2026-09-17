"use client";

import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EMPLOYEE_INVITATIONS_COPY } from "@/copy/employee-invitations-copy";

export type EmployeesPageTab = "staff" | "invitations";

type EmployeesPageTabsProps = {
  invitationCount: number;
};

export default function EmployeesPageTabs({
  invitationCount,
}: EmployeesPageTabsProps) {
  return (
    <TabsList
      variant="line"
      aria-label={EMPLOYEE_INVITATIONS_COPY.tabs.ariaLabel}
      className="no-scrollbar flex w-full shrink-0 justify-start overflow-x-auto border-b border-border-subtle"
    >
      <TabsTrigger
        value="staff"
        className="shrink-0 rounded-none px-4 py-3 text-[0.8rem] font-medium whitespace-nowrap"
      >
        {EMPLOYEE_INVITATIONS_COPY.tabs.staff}
      </TabsTrigger>
      <TabsTrigger
        value="invitations"
        className="shrink-0 rounded-none px-4 py-3 text-[0.8rem] font-medium whitespace-nowrap"
      >
        {`${EMPLOYEE_INVITATIONS_COPY.tabs.invitations} (${invitationCount})`}
      </TabsTrigger>
    </TabsList>
  );
}
