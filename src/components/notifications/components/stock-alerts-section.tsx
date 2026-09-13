"use client";

import InventoryAlertItem from "@/components/notifications/components/inventory-alert-item";
import { NOTIFICATIONS_COPY } from "@/copy/external-appointment-copy";
import type { InventoryAlert } from "@/types/database.types";

type StockAlertsSectionProps = {
  alerts: InventoryAlert[];
  onClose: () => void;
};

export default function StockAlertsSection({
  alerts,
  onClose,
}: StockAlertsSectionProps) {
  const visible = alerts.slice(0, 5);

  return (
    <section className="space-y-3" aria-labelledby="stock-notifications-title">
      <div className="flex items-center justify-between">
        <h2
          id="stock-notifications-title"
          className="text-xs font-semibold uppercase tracking-wide text-ink-muted"
        >
          {NOTIFICATIONS_COPY.stockSection}
        </h2>
        {alerts.length > 5 ? (
          <span className="text-xs text-ink-secondary">
            {NOTIFICATIONS_COPY.more(alerts.length - 5)}
          </span>
        ) : null}
      </div>
      <div className="space-y-2">
        {visible.map((alert) => (
          <InventoryAlertItem key={alert.id} alert={alert} onClose={onClose} />
        ))}
      </div>
    </section>
  );
}
