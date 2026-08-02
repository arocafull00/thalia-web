"use client";

import { Bell, Download, Plus } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

import { MARKETING_COPY } from "@/components/marketing/marketing-copy";
import PwaInstallDialog from "@/components/pwa/components/pwa-install-dialog";
import { usePwaInstall } from "@/components/pwa/hooks/use-pwa-install";
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
import NotificationsSheet from "@/components/ui/notifications-sheet";
import { ActionButton } from "@/components/ui/primitives/action-button";
import ProfileActionsMenu from "@/components/ui/profile/profile-actions-menu";
import { SidebarTrigger } from "@/components/ui/sidebar";
import TopbarClinicSelector from "@/components/ui/topbar-clinic-selector";
import { APPOINTMENTS_COPY } from "@/copy/appointments-copy";
import { EMPLOYEES_COPY } from "@/copy/employees-copy";
import { FILES_COPY } from "@/copy/files-copy";
import { FINANCES_COPY } from "@/copy/finances-copy";
import { INVENTORY_COPY } from "@/copy/inventory-copy";
import { PATIENTS_COPY } from "@/copy/patients-copy";
import { PWA_INSTALL_COPY } from "@/copy/pwa-install-copy";
import { SETTINGS_COPY } from "@/copy/settings-copy";
import { getActiveClinicId } from "@/lib/active-clinic-id";
import { useInventoryAlertsStore } from "@/stores/inventory-alerts-store";
import { useTopbarActionStore } from "@/stores/topbar-action-store";

const PAGE_TITLES_BY_ROUTE: Record<string, string> = {
  "/appointments": APPOINTMENTS_COPY.page.title,
  "/employees": EMPLOYEES_COPY.page.title,
  "/files": FILES_COPY.page.title,
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
  const [pwaInstallOpen, setPwaInstallOpen] = useState(false);
  const action = useTopbarActionStore((state) => state.action);
  const breadcrumb = useTopbarActionStore((state) => state.breadcrumb);
  const actions = useTopbarActionStore((state) => state.actions);
  const menu = useTopbarActionStore((state) => state.menu);
  const unreadCount = useInventoryAlertsStore((state) => state.unreadCount);
  const markAsRead = useInventoryAlertsStore((state) => state.markAsRead);
  const { canPromptInstall, handleInstall, showInstallCta } = usePwaInstall();
  const title =
    PAGE_TITLES_BY_ROUTE[pathname] ??
    (pathname.startsWith("/settings") ? SETTINGS_COPY.page.title : undefined);
  const primaryAction = action ?? actions[0] ?? null;
  const hasOverflowMenu =
    menu?.sections.some((section) => section.actions.length > 0) ?? false;

  const handlePwaInstallClick = () => {
    if (canPromptInstall) {
      void handleInstall();
      return;
    }

    setPwaInstallOpen(true);
  };

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
          {showInstallCta ? (
            <ActionButton
              title={PWA_INSTALL_COPY.installButton}
              icon={Download}
              variant="ghost"
              testId="pwa-install-topbar"
              onClick={handlePwaInstallClick}
            />
          ) : null}
          {primaryAction ? (
            <ActionButton
              title={primaryAction.title}
              icon={primaryAction.icon ?? Plus}
              disabled={primaryAction.disabled}
              variant={primaryAction.variant}
              testId={primaryAction.testId}
              onClick={primaryAction.onClick}
            />
          ) : null}
          {hasOverflowMenu && menu ? (
            <ProfileActionsMenu
              sections={menu.sections}
              ariaLabel={menu.ariaLabel}
            />
          ) : null}
        </div>
      </div>
      <PwaInstallDialog
        open={pwaInstallOpen}
        onOpenChange={setPwaInstallOpen}
      />
    </header>
  );
}
