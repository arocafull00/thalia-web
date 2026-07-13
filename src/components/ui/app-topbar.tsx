"use client";

import { Bell, Plus } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { TREATMENTS_COPY } from "@/components/treatments/treatments-copy";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { ActionButton } from "@/components/ui/primitives/action-button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import TopbarClinicSelector from "@/components/ui/topbar-clinic-selector";
import { TopbarSecondaryAction } from "@/components/ui/topbar-secondary-action";
import { APPOINTMENTS_COPY } from "@/copy/appointments-copy";
import { EMPLOYEES_COPY } from "@/copy/employees-copy";
import { FINANCES_COPY } from "@/copy/finances-copy";
import { INVENTORY_COPY } from "@/copy/inventory-copy";
import { PATIENTS_COPY } from "@/copy/patients-copy";
import { SETTINGS_COPY } from "@/copy/settings-copy";
import { useTopbarActionStore } from "@/stores/topbar-action-store";

const PAGE_TITLES_BY_ROUTE: Record<string, string> = {
  "/appointments": APPOINTMENTS_COPY.page.title,
  "/employees": EMPLOYEES_COPY.page.title,
  "/finances": FINANCES_COPY.title,
  "/inventory": INVENTORY_COPY.page.title,
  "/patients": PATIENTS_COPY.page.title,
  "/settings": SETTINGS_COPY.page.title,
  "/treatments": TREATMENTS_COPY.page.title,
};

export default function AppTopbar() {
  const pathname = usePathname();
  const action = useTopbarActionStore((state) => state.action);
  const breadcrumb = useTopbarActionStore((state) => state.breadcrumb);
  const actions = useTopbarActionStore((state) => state.actions);
  const menu = useTopbarActionStore((state) => state.menu);
  const notificationCount = 0;
  const title = PAGE_TITLES_BY_ROUTE[pathname];
  const primaryTitles = new Set(
    actions.map((topbarAction) => topbarAction.title),
  );
  const secondaryMenuActions =
    menu?.actions.filter(
      (menuAction) => !primaryTitles.has(menuAction.label),
    ) ?? [];

  return (
    <header className="sticky top-0 z-40 grid h-12 grid-cols-[1fr_auto_1fr] items-center gap-2 border-b border-border-subtle bg-surface px-6">
      <div className="flex min-w-0 items-center gap-2">
        <SidebarTrigger
          variant="ghost"
          size="icon"
          className="shrink-0 rounded-button text-ink-secondary hover:bg-(--hover-overlay) hover:text-ink lg:hidden"
        />
        {breadcrumb ? (
          <Breadcrumb
            aria-label={breadcrumb.rootLabel}
            className="min-w-0 flex-1"
          >
            <BreadcrumbList className="min-w-0 flex-nowrap">
              <BreadcrumbItem className="shrink-0">
                <BreadcrumbLink asChild>
                  <Link href={breadcrumb.rootHref}>{breadcrumb.rootLabel}</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="shrink-0" />
              <BreadcrumbItem className="min-w-0">
                <BreadcrumbPage className="truncate">
                  {breadcrumb.currentLabel}
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        ) : title ? (
          <h1 className="truncate text-sm font-medium text-ink-secondary">
            {title}
          </h1>
        ) : null}
      </div>
      <div className="flex justify-center">
        <TopbarClinicSelector />
      </div>
      <div className="flex items-center justify-end gap-2">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          aria-label="Notificaciones"
          className="relative"
        >
          <Bell size={18} strokeWidth={1.5} />
          {notificationCount > 0 ? (
            <span className="absolute right-1.5 top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-danger px-1 text-[10px] font-semibold text-white">
              {notificationCount > 99 ? "99+" : notificationCount}
            </span>
          ) : null}
        </Button>
        {actions.length > 0 || secondaryMenuActions.length > 0 ? (
          <div className="flex items-center gap-2">
            {secondaryMenuActions.map((menuAction) => (
              <TopbarSecondaryAction
                key={menuAction.label}
                action={menuAction}
              />
            ))}
            {actions.map((topbarAction) => (
              <ActionButton
                key={topbarAction.title}
                title={topbarAction.title}
                icon={topbarAction.icon}
                disabled={topbarAction.disabled}
                variant={topbarAction.variant}
                onClick={topbarAction.onClick}
              />
            ))}
          </div>
        ) : null}
        {action ? (
          <span className="hidden lg:contents">
            <ActionButton
              title={action.title}
              icon={action.icon ?? Plus}
              disabled={action.disabled}
              onClick={action.onClick}
            />
          </span>
        ) : null}
      </div>
    </header>
  );
}
