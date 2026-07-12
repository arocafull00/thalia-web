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
import ProfileActionsMenu from "@/components/ui/profile/profile-actions-menu";
import { SidebarTrigger } from "@/components/ui/sidebar";
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
  const desktopMenuActions = menu ? menu.actions.slice(2) : [];
  const mobileMenuActions = menu?.actions ?? [];

  return (
    <header className="sticky top-0 z-40 flex h-12 items-center gap-2 border-b border-border-subtle bg-surface px-6">
      <SidebarTrigger
        variant="ghost"
        size="icon"
        className="rounded-button text-ink-secondary hover:bg-[var(--hover-overlay)] hover:text-ink lg:hidden"
      />
      {breadcrumb ? (
        <Breadcrumb aria-label={breadcrumb.rootLabel} className="min-w-0">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href={breadcrumb.rootHref}>{breadcrumb.rootLabel}</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
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
      <div className="ml-auto flex items-center gap-2">
        {actions.length > 0 ? (
          <div className="hidden items-center gap-2 lg:flex">
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
        {menu && desktopMenuActions.length > 0 ? (
          <div className="hidden lg:contents">
            <ProfileActionsMenu
              actions={desktopMenuActions}
              ariaLabel={menu.ariaLabel}
            />
          </div>
        ) : null}
        {menu && mobileMenuActions.length > 0 ? (
          <ProfileActionsMenu
            actions={mobileMenuActions}
            ariaLabel={menu.ariaLabel}
            className="lg:hidden"
          />
        ) : null}
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
