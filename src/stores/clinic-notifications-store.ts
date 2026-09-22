import { getQueryEpoch, isCurrentQueryEpoch } from "@/stores/query-epoch";
import type { RealtimeChannel } from "@supabase/supabase-js";
import { toast } from "sonner";
import { create } from "zustand";

import { CLINIC_NOTIFICATION_COPY } from "@/copy/external-appointment-copy";
import {
  getClinicNotifications,
  subscribeClinicNotifications,
  unsubscribeClinicNotifications,
} from "@/dal/clinic-notifications.dal";
import { logger } from "@/lib/logger";
import {
  emptyQueryEntry,
  errorQueryEntry,
  loadingQueryEntry,
  successQueryEntry,
  type QueryEntry,
} from "@/stores/query-state";
import type {
  ClinicNotification,
  ClinicNotificationWithClinic,
} from "@/types/database.types";

type ClinicNotificationsStore = {
  notifications: QueryEntry<ClinicNotificationWithClinic[]>;
  unreadCount: number;
  fetchNotifications: (clinicId: string) => Promise<void>;
  markAsRead: () => Promise<void>;
  subscribeRealtime: (clinicId: string) => void;
  unsubscribeRealtime: () => void;
};

let channel: RealtimeChannel | null = null;

export const useClinicNotificationsStore = create<ClinicNotificationsStore>(
  (set, get) => ({
    notifications: emptyQueryEntry(),
    unreadCount: 0,

    fetchNotifications: async (clinicId) => {
      const epoch = getQueryEpoch();
      if (!isCurrentQueryEpoch(epoch)) return;
      set({ notifications: loadingQueryEntry(get().notifications) });

      try {
        const result = await getClinicNotifications(clinicId);
        if (!isCurrentQueryEpoch(epoch)) return;
        set({
          notifications: successQueryEntry(result.notifications),
          unreadCount: result.unreadCount,
        });
      } catch (cause) {
        const error = cause instanceof Error ? cause : new Error(String(cause));
        logger.captureException(error, {
          store: "clinic-notifications-store",
          action: "fetchNotifications",
          clinicId,
        });
        if (!isCurrentQueryEpoch(epoch)) return;
        set({
          notifications: errorQueryEntry(error, get().notifications),
        });
      }
    },

    markAsRead: async () => {
      const previousCount = get().unreadCount;
      set({ unreadCount: 0 });

      try {
        const { markClinicNotificationsAsReadAction } =
          await import("@/components/notifications/actions");
        await markClinicNotificationsAsReadAction();
        const notifications = get().notifications.data;

        if (notifications) {
          const readAt = new Date().toISOString();
          set({
            notifications: successQueryEntry(
              notifications.map((notification) =>
                notification.read_at
                  ? notification
                  : { ...notification, read_at: readAt },
              ),
            ),
          });
        }
      } catch (cause) {
        set({ unreadCount: previousCount });
        logger.captureException(cause, {
          store: "clinic-notifications-store",
          action: "markAsRead",
        });
      }
    },

    subscribeRealtime: (clinicId) => {
      if (channel) {
        return;
      }

      channel = subscribeClinicNotifications(
        clinicId,
        (notification: ClinicNotification) => {
          toast.info(CLINIC_NOTIFICATION_COPY[notification.type].toast);
          void get().fetchNotifications(clinicId);
        },
        () => {
          void get().fetchNotifications(clinicId);
        },
      );
    },

    unsubscribeRealtime: () => {
      if (!channel) {
        return;
      }

      void unsubscribeClinicNotifications(channel);
      channel = null;
    },
  }),
);
