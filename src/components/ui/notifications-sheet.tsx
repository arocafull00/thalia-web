"use client";

import ClinicInvitationsSection from "@/components/notifications/components/clinic-invitations-section";
import ClinicNotificationsSection from "@/components/notifications/components/clinic-notifications-section";
import StockAlertsSection from "@/components/notifications/components/stock-alerts-section";
import AppDialogHeader from "@/components/ui/app-dialog-header";
import AppDialogTitle from "@/components/ui/app-dialog-title";
import AppSheetContent from "@/components/ui/app-sheet-content";
import { SkeletonList } from "@/components/ui/primitives/skeleton-list";
import { NOTIFICATIONS_COPY } from "@/copy/external-appointment-copy";
import type { PendingClinicRequest } from "@/lib/clinic-requests";
import type { QueryEntry } from "@/stores/query-state";
import type {
  ClinicNotificationWithClinic,
  InventoryAlert,
} from "@/types/database.types";

export default function NotificationsSheet({
  alerts,
  notifications,
  invitations,
  timezone,
  onClose,
  onInvitationSelect,
  onRetryInvitations,
}: {
  alerts: QueryEntry<InventoryAlert[]>;
  notifications: QueryEntry<ClinicNotificationWithClinic[]>;
  invitations: QueryEntry<PendingClinicRequest[]>;
  timezone: string;
  onClose: () => void;
  onInvitationSelect: (invitation: PendingClinicRequest) => void;
  onRetryInvitations: () => void;
}) {
  const isLoading =
    (alerts.loading && !alerts.data) ||
    (notifications.loading && !notifications.data) ||
    (invitations.loading && !invitations.data);
  const stockItems = alerts.data ?? [];
  const appointmentItems = notifications.data ?? [];
  const invitationItems = invitations.data ?? [];
  const hasInvitationError = Boolean(invitations.error);
  const isEmpty =
    !isLoading &&
    !hasInvitationError &&
    stockItems.length === 0 &&
    appointmentItems.length === 0 &&
    invitationItems.length === 0;

  return (
    <AppSheetContent>
      <AppDialogHeader>
        <AppDialogTitle>{NOTIFICATIONS_COPY.title}</AppDialogTitle>
      </AppDialogHeader>
      <div className="min-h-0 flex-1 overflow-y-auto px-1 py-4">
        {isLoading ? <SkeletonList /> : null}
        {isEmpty ? (
          <p className="text-center text-sm text-ink-secondary">
            {NOTIFICATIONS_COPY.empty}
          </p>
        ) : null}
        {!isLoading && (invitationItems.length > 0 || hasInvitationError) ? (
          <ClinicInvitationsSection
            invitations={invitations}
            onSelect={onInvitationSelect}
            onRetry={onRetryInvitations}
          />
        ) : null}
        {!isLoading && appointmentItems.length > 0 ? (
          <div
            className={
              invitationItems.length > 0 || hasInvitationError
                ? "mt-6"
                : undefined
            }
          >
            <ClinicNotificationsSection
              notifications={appointmentItems}
              timezone={timezone}
              onClose={onClose}
            />
          </div>
        ) : null}
        {!isLoading && stockItems.length > 0 ? (
          <div
            className={
              appointmentItems.length > 0 ||
              invitationItems.length > 0 ||
              hasInvitationError
                ? "mt-6"
                : undefined
            }
          >
            <StockAlertsSection alerts={stockItems} onClose={onClose} />
          </div>
        ) : null}
      </div>
    </AppSheetContent>
  );
}
