"use client";

import { AlertTriangle, ArrowRight } from "lucide-react";
import Link from "next/link";

import AppDialogHeader from "@/components/ui/app-dialog-header";
import AppDialogTitle from "@/components/ui/app-dialog-title";
import AppSheetContent from "@/components/ui/app-sheet-content";
import { SkeletonList } from "@/components/ui/primitives/skeleton-list";
import { useInventoryAlertsStore } from "@/stores/inventory-alerts-store";
import type { InventoryAlert } from "@/types/database.types";

function InventoryAlertItem({
  alert,
  onClose,
}: {
  alert: InventoryAlert;
  onClose: () => void;
}) {
  const shortage = alert.min_stock - alert.stock;
  const message =
    shortage > 0
      ? `Quedan ${alert.stock} unidades — ${shortage} por debajo del mínimo (${alert.min_stock})`
      : `Quedan ${alert.stock} unidades — solo ${10 - (alert.stock - alert.min_stock)} por encima del mínimo`;

  return (
    <div className="flex gap-3 rounded-xl border border-warning/30 bg-warning/5 p-4">
      <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-warning/20">
        <AlertTriangle className="size-4 text-warning" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-ink">
          {alert.item_name}
        </p>
        <p className="mt-0.5 text-xs text-ink-secondary">{message}</p>
      </div>
      <Link
        href={`/inventory/${alert.inventory_item_id}`}
        onClick={onClose}
        className="flex shrink-0 items-center gap-1 text-xs text-ink-secondary hover:text-ink"
      >
        Ver
        <ArrowRight className="size-3" />
      </Link>
    </div>
  );
}

function StockAlertsSection({
  alerts,
  onClose,
}: {
  alerts: InventoryAlert[];
  onClose: () => void;
}) {
  const visible = alerts.slice(0, 5);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-xs font-semibold uppercase tracking-wide text-ink-muted">
          Stock bajo
        </h2>
        {alerts.length > 5 ? (
          <span className="text-xs text-ink-secondary">
            +{alerts.length - 5} más
          </span>
        ) : null}
      </div>
      <div className="space-y-2">
        {visible.map((alert) => (
          <InventoryAlertItem key={alert.id} alert={alert} onClose={onClose} />
        ))}
      </div>
    </div>
  );
}

export default function NotificationsSheet({
  onClose,
}: {
  onClose: () => void;
}) {
  const alerts = useInventoryAlertsStore((state) => state.alerts);

  const isLoading = alerts.loading && !alerts.data;
  const items = alerts.data ?? [];
  const isEmpty = !isLoading && items.length === 0;

  return (
    <AppSheetContent>
      <AppDialogHeader>
        <AppDialogTitle>Notificaciones</AppDialogTitle>
      </AppDialogHeader>
      <div className="min-h-0 flex-1 overflow-y-auto px-1 py-4">
        {isLoading ? <SkeletonList /> : null}
        {isEmpty ? (
          <p className="text-center text-sm text-ink-secondary">
            No hay notificaciones pendientes
          </p>
        ) : null}
        {!isLoading && items.length > 0 ? (
          <StockAlertsSection alerts={items} onClose={onClose} />
        ) : null}
      </div>
    </AppSheetContent>
  );
}
