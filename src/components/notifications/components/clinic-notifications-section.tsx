"use client";

import ClinicNotificationItem from "@/components/notifications/components/clinic-notification-item";
import { NOTIFICATIONS_COPY } from "@/copy/external-appointment-copy";
import type { ClinicNotificationWithClinic } from "@/types/database.types";

type ClinicNotificationsSectionProps = {
  notifications: ClinicNotificationWithClinic[];
  timezone: string;
  onClose: () => void;
};

export default function ClinicNotificationsSection({
  notifications,
  timezone,
  onClose,
}: ClinicNotificationsSectionProps) {
  return (
    <section
      className="space-y-3"
      aria-labelledby="appointment-notifications-title"
    >
      <h2
        id="appointment-notifications-title"
        className="text-xs font-semibold uppercase tracking-wide text-ink-muted"
      >
        {NOTIFICATIONS_COPY.appointmentsSection}
      </h2>
      <div className="space-y-2">
        {notifications.map((notification) => (
          <ClinicNotificationItem
            key={notification.id}
            notification={notification}
            timezone={timezone}
            onClose={onClose}
          />
        ))}
      </div>
    </section>
  );
}
