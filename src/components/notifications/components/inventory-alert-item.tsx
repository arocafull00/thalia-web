"use client";

import { AlertTriangle, ArrowRight } from "lucide-react";
import Link from "next/link";

import { NOTIFICATIONS_COPY } from "@/copy/external-appointment-copy";
import type { InventoryAlert } from "@/types/database.types";

type InventoryAlertItemProps = {
  alert: InventoryAlert;
  onClose: () => void;
};

export default function InventoryAlertItem({
  alert,
  onClose,
}: InventoryAlertItemProps) {
  const shortage = alert.min_stock - alert.stock;
  const message =
    shortage > 0
      ? `Quedan ${alert.stock} unidades — ${shortage} por debajo del mínimo (${alert.min_stock})`
      : `Quedan ${alert.stock} unidades — solo ${10 - (alert.stock - alert.min_stock)} por encima del mínimo`;

  return (
    <div className="flex gap-3 rounded-xl border border-warning/30 bg-warning/5 p-4">
      <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-warning/20">
        <AlertTriangle className="size-4 text-warning" aria-hidden="true" />
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
        className="flex shrink-0 items-center gap-1 rounded-md text-xs text-ink-secondary outline-none hover:text-ink focus-visible:ring-2 focus-visible:ring-primary"
      >
        {NOTIFICATIONS_COPY.view}
        <ArrowRight className="size-3" aria-hidden="true" />
      </Link>
    </div>
  );
}
