"use client";

import { Bell, MoreHorizontal, Plus } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

import { MARKETING_COPY } from "@/components/marketing/marketing-copy";
import { TREATMENTS_COPY } from "@/components/treatments/treatments-copy";
import AppDialog from "@/components/ui/app-dialog";
import { Badge } from "@/components/ui/badge";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import NotificationsSheet from "@/components/ui/notifications-sheet";
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
import { getActiveClinicId } from "@/lib/active-clinic-id";
import { useInventoryAlertsStore } from "@/stores/inventory-alerts-store";
import {
  type TopbarAction,
  useTopbarActionStore,
} from "@/stores/topbar-action-store";

const PAGE_TITLES_BY_ROUTE: Record<string, string> = {
  "/appointments": APPOINTMENTS_COPY.page.title,
  "/employees": EMPLOYEES_COPY.page.title,
  "/finances": FINANCES_COPY.title,
  "/inventory": INVENTORY_COPY.page.title,
  "/marketing": MARKETING_COPY.page.title,
  "/patients": PATIENTS_COPY.page.title,
  "/settings": SETTINGS_COPY.page.title,
  "/treatments": TREATMENTS_COPY.page.title,
};

export default function AppTopbar() {
  const pathname = usePathname();
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const action = useTopbarActionStore((state) => state.action);
  const breadcrumb = useTopbarActionStore((state) => state.breadcrumb);
  const actions = useTopbarActionStore((state) => state.actions);
  const menu = useTopbarActionStore((state) => state.menu);
  const unreadCount = useInventoryAlertsStore((state) => state.unreadCount);
  const markAsRead = useInventoryAlertsStore((state) => state.markAsRead);
  const title = PAGE_TITLES_BY_ROUTE[pathname];
  const primaryTitles = new Set(
    actions.map((topbarAction) => topbarAction.title),
  );
  const secondaryMenuActions =
    menu?.actions.filter(
      (menuAction) => !primaryTitles.has(menuAction.label),
    ) ?? [];

  const allMobileActions: TopbarAction[] = [
    ...(action ? [action] : []),
    ...actions,
    ...secondaryMenuActions.map((menuAction): TopbarAction => ({
      title: menuAction.label,
      icon: menuAction.icon,
      onClick: menuAction.onClick ?? (() => {}),
      disabled: false,
      variant: menuAction.variant === "danger" ? "ghost" : "ghost",
    })),
  ];
  const hasMobileActions = allMobileActions.length > 0;

  return (
    <header data-testid="app-topbar" className="sticky top-0 z-40 mb-6">
      <div className="flex flex-wrap items-center gap-x-2 px-6 lg:grid lg:h-12 lg:grid-cols-[1fr_auto_1fr]">
        <div className="order-1 flex h-12 min-w-0 flex-1 items-center gap-2">
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
                    <Link href={breadcrumb.rootHref}>
                      {breadcrumb.rootLabel}
                    </Link>
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
        <div className="order-3 flex w-full items-center justify-center border-t border-border-subtle py-2 lg:order-2 lg:w-auto lg:border-t-0 lg:py-0">
          <TopbarClinicSelector />
        </div>
        <div className="order-2 flex h-12 items-center justify-end gap-2 lg:order-3">
          <AppDialog
            open={notificationsOpen}
            onOpenChange={setNotificationsOpen}
          >
            <Button
              type="button"
              variant="ghost"
              size="icon"
              aria-label="Notificaciones"
              className="relative size-9 text-ink-secondary hover:text-ink"
              onClick={() => {
                setNotificationsOpen(true);
                const clinicId = getActiveClinicId();
                if (clinicId) void markAsRead(clinicId);
              }}
            >
              <Bell size={20} strokeWidth={1.75} />
              {unreadCount > 0 ? (
                <Badge
                  variant="danger"
                  className="absolute right-0 top-0 min-w-4 -translate-y-1/4 translate-x-1/4 justify-center px-1 py-0 text-[9px] leading-4"
                >
                  {unreadCount > 99 ? "99+" : unreadCount}
                </Badge>
              ) : null}
            </Button>
            <NotificationsSheet onClose={() => setNotificationsOpen(false)} />
          </AppDialog>
          {hasMobileActions ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild className="lg:hidden">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  aria-label="Más acciones"
                >
                  <MoreHorizontal size={18} strokeWidth={1.5} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {allMobileActions.map((mobileAction) => {
                  const Icon = mobileAction.icon ?? Plus;
                  return (
                    <DropdownMenuItem
                      key={mobileAction.title}
                      onClick={mobileAction.onClick}
                      disabled={mobileAction.disabled}
                      data-testid={mobileAction.testId}
                    >
                      <Icon className="size-4 shrink-0" aria-hidden="true" />
                      {mobileAction.title}
                    </DropdownMenuItem>
                  );
                })}
              </DropdownMenuContent>
            </DropdownMenu>
          ) : null}
          <div className="hidden items-center gap-2 lg:flex">
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
                testId={topbarAction.testId}
                onClick={topbarAction.onClick}
              />
            ))}
            {action ? (
              <ActionButton
                title={action.title}
                icon={action.icon ?? Plus}
                disabled={action.disabled}
                testId={action.testId}
                onClick={action.onClick}
              />
            ) : null}
          </div>
        </div>
      </div>
    </header>
  );
}
