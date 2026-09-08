"use client";

import { Bell, Download, MoreVertical, Plus } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo, useState } from "react";

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
import type {
  ProfileAction,
  ProfileActionSection,
} from "@/components/ui/profile/profile-action";
import ProfileActionsMenu from "@/components/ui/profile/profile-actions-menu";
import { SidebarTrigger } from "@/components/ui/sidebar";
import TopbarClinicSelector from "@/components/ui/topbar-clinic-selector";
import { PWA_INSTALL_COPY } from "@/copy/pwa-install-copy";
import { TOPBAR_COPY } from "@/copy/topbar-copy";
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

  const handleNotificationsClick = () => {
    setNotificationsOpen(true);
    const clinicId = getActiveClinicId();

    if (clinicId) {
      void markAsRead(clinicId);
    }
  };

  /*
   * En móvil no caben la campana, el CTA de instalar y los botones de la
   * pantalla junto al título: se apilaban y partían la barra en dos filas. Se
   * refunden en un único menú de tres puntos, como el de las filas de tabla.
   * El selector de clínica se queda fuera: tiene su propia fila.
   */
  const mobileMenuSections = useMemo<ProfileActionSection[]>(() => {
    const appActions: ProfileAction[] = [
      {
        label:
          unreadCount > 0
            ? `${TOPBAR_COPY.notifications} (${unreadCount > 99 ? "99+" : unreadCount})`
            : TOPBAR_COPY.notifications,
        icon: Bell,
        onClick: handleNotificationsClick,
        testId: "topbar-notifications-mobile",
      },
    ];

    if (showInstallCta) {
      appActions.push({
        label: PWA_INSTALL_COPY.installButton,
        icon: Download,
        onClick: handlePwaInstallClick,
        testId: "pwa-install-topbar-mobile",
      });
    }

    const pageActions: ProfileAction[] = topbarActions
      // `desktopOnly` deja de ser decorativo: lo que se marque así no baja al
      // menú móvil.
      .filter((topbarAction) => !topbarAction.desktopOnly)
      .map((topbarAction) => ({
        label: topbarAction.title,
        icon: topbarAction.icon ?? Plus,
        onClick: topbarAction.onClick,
        disabled: topbarAction.disabled,
        testId: topbarAction.testId,
      }));

    return [
      { label: TOPBAR_COPY.sections.app, actions: appActions },
      ...(pageActions.length > 0
        ? [{ label: TOPBAR_COPY.sections.page, actions: pageActions }]
        : []),
      ...(menu?.sections ?? []),
    ];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [menu, showInstallCta, topbarActions, unreadCount]);

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
          {/* Escritorio: cada acción con su propio botón. */}
          <div className="hidden items-center gap-2.5 lg:flex">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              aria-label={TOPBAR_COPY.notifications}
              className="control-chip relative size-[38px] rounded-button text-ink-secondary hover:text-ink"
              onClick={handleNotificationsClick}
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
          {/* Móvil: todo lo anterior refundido en un solo menú. */}
          <div className="relative lg:hidden">
            <ProfileActionsMenu
              icon={MoreVertical}
              sections={mobileMenuSections}
              ariaLabel={TOPBAR_COPY.moreActions}
              className="control-chip size-[38px] rounded-button text-ink-secondary hover:text-ink"
              // El mínimo por defecto son 8rem y ahí parten en dos líneas
              // etiquetas como «Instalar Thalia» o «Editar paciente».
              contentClassName="min-w-56"
            />
            {unreadCount > 0 ? (
              // El contador vive dentro del menú, pero sin esta señal en el
              // disparador no habría forma de saber que hay avisos sin abrirlo.
              <Badge
                aria-hidden="true"
                variant="danger"
                className="pointer-events-none absolute right-0 top-0 min-w-4 -translate-y-1/4 translate-x-1/4 justify-center px-1 py-0 text-[9px] leading-4"
              >
                {unreadCount > 99 ? "99+" : unreadCount}
              </Badge>
            ) : null}
          </div>
        </div>
      </div>
      <AppDialog open={notificationsOpen} onOpenChange={setNotificationsOpen}>
        <NotificationsSheet onClose={() => setNotificationsOpen(false)} />
      </AppDialog>
      <PwaInstallDialog
        open={pwaInstallOpen}
        onOpenChange={setPwaInstallOpen}
      />
    </header>
  );
}
