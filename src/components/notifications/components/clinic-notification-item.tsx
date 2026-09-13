"use client";

import { ArrowRight, CalendarClock } from "lucide-react";
import Link from "next/link";

import {
  CLINIC_NOTIFICATION_COPY,
  NOTIFICATIONS_COPY,
} from "@/copy/external-appointment-copy";
import { formatDateTime } from "@/lib/format";
import type { ClinicNotificationWithClinic } from "@/types/database.types";

type ClinicNotificationItemProps = {
  notification: ClinicNotificationWithClinic;
  timezone: string;
  onClose: () => void;
};

export default function ClinicNotificationItem({
  notification,
  timezone,
  onClose,
}: ClinicNotificationItemProps) {
  const copy = CLINIC_NOTIFICATION_COPY[notification.type];
  const clinicAndTime = `${notification.clinics?.name ?? NOTIFICATIONS_COPY.clinicFallback} · ${formatDateTime(notification.starts_at, timezone)}`;
  const canOpenAppointment =
    notification.type !== "external_appointment_cancelled" &&
    Boolean(notification.appointment_id);

  return (
    <article className="flex gap-3 rounded-xl border border-border-subtle bg-surface p-4">
      <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary-subtle">
        <CalendarClock
          className="size-4 text-primary-light"
          aria-hidden="true"
        />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-ink">{copy.title}</p>
        <p className="mt-0.5 text-xs text-ink-secondary">{copy.body}</p>
        <p className="mt-1 text-xs text-ink-muted">{clinicAndTime}</p>
      </div>
      {canOpenAppointment ? (
        <Link
          href={`/appointments/${notification.appointment_id}`}
          onClick={onClose}
          aria-label={NOTIFICATIONS_COPY.appointmentLinkAriaLabel(copy.title)}
          className="flex shrink-0 items-center gap-1 rounded-md text-xs text-ink-secondary outline-none hover:text-ink focus-visible:ring-2 focus-visible:ring-primary"
        >
          {NOTIFICATIONS_COPY.view}
          <ArrowRight className="size-3" aria-hidden="true" />
        </Link>
      ) : null}
    </article>
  );
}
