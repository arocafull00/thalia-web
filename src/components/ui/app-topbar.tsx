"use client";

import { Bell, Download, Plus } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

import PwaInstallDialog from "@/components/pwa/components/pwa-install-dialog";
import { usePwaInstall } from "@/components/pwa/hooks/use-pwa-install";
import AppDialog from "@/components/ui/app-dialog";
import { Badge } from "@/components/ui/badge";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import NotificationsSheet from "@/components/ui/notifications-sheet";
import { ActionButton } from "@/components/ui/primitives/action-button";
import ProfileActionsMenu from "@/components/ui/profile/profile-actions-menu";
import { SidebarTrigger } from "@/components/ui/sidebar";
import TopbarClinicSelector from "@/components/ui/topbar-clinic-selector";
import { PWA_INSTALL_COPY } from "@/copy/pwa-install-copy";
import { getActiveClinicId } from "@/lib/active-clinic-id";
import { appNavItemTitle } from "@/lib/hooks/use-app-nav-items";
import { useInventoryAlertsStore } from "@/stores/inventory-alerts-store";
import { useTopbarActionStore } from "@/stores/topbar-action-store";

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
  const title = appNavItemTitle(pathname);
  const topbarActions = action ? [action] : actions;
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
    <header data-testid="app-topbar" className="sticky top-0 z-40 mb-3.5">
      <div className="surface-card flex flex-wrap items-center gap-x-2.5 rounded-dialog px-4 lg:flex-nowrap lg:px-5">
        <div className="order-1 flex min-w-0 flex-1 items-center gap-2 py-2">
          <SidebarTrigger
            variant="ghost"
            size="icon"
            className="shrink-0 rounded-button text-ink-secondary hover:bg-(--hover-overlay) hover:text-ink lg:hidden"
          />
          {breadcrumb ? (
            <div className="min-w-0 flex-1">
              <Breadcrumb aria-label={breadcrumb.rootLabel} className="min-w-0">
                <BreadcrumbList className="min-w-0 flex-nowrap text-xs text-ink-muted">
                  <BreadcrumbItem className="shrink-0">
                    <BreadcrumbLink asChild>
                      <Link href={breadcrumb.rootHref}>
                        {breadcrumb.rootLabel}
                      </Link>
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator className="shrink-0" />
                </BreadcrumbList>
              </Breadcrumb>
              <h1 className="truncate text-[24px] font-semibold leading-[1.1] tracking-[-0.02em] text-ink">
                {breadcrumb.currentLabel}
              </h1>
            </div>
          ) : title ? (
            <h1 className="truncate text-[24px] font-semibold leading-[1.1] tracking-[-0.02em] text-ink">
              {title}
            </h1>
          ) : null}
        </div>
        <div className="order-3 flex w-full items-center justify-center border-t border-border-subtle py-2 lg:order-2 lg:w-auto lg:border-t-0 lg:py-0">
          <TopbarClinicSelector />
        </div>
        <div className="order-2 flex items-center justify-end gap-2.5 py-2 lg:order-3">
          <AppDialog
            open={notificationsOpen}
            onOpenChange={setNotificationsOpen}
          >
            <Button
              type="button"
              variant="ghost"
              size="icon"
              aria-label="Notificaciones"
              className="control-chip relative size-[38px] rounded-button text-ink-secondary hover:text-ink"
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
              className="control-chip h-[38px] rounded-button text-[13.5px]"
            />
          ) : null}
          {topbarActions.map((topbarAction, index) => (
            <ActionButton
              key={`${topbarAction.testId ?? topbarAction.title}-${index}`}
              title={topbarAction.title}
              icon={topbarAction.icon ?? Plus}
              iconClassName={topbarAction.iconClassName}
              disabled={topbarAction.disabled}
              variant={topbarAction.variant}
              testId={topbarAction.testId}
              onClick={topbarAction.onClick}
              className={
                topbarAction.variant === "ghost"
                  ? "control-chip h-[38px] rounded-button text-[13.5px]"
                  : "h-[38px] rounded-button bg-[image:var(--gradient-primary)] text-[13.5px] shadow-glow transition-shadow hover:shadow-glow-strong"
              }
            />
          ))}
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
