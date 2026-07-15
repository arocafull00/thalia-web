import type { RealtimeChannel } from "@supabase/supabase-js";
import { toast } from "react-toastify";
import { create } from "zustand";

import {
  getInventoryAlerts,
  markInventoryAlertsAsRead,
} from "@/dal/inventory-alerts.dal";
import { logger } from "@/lib/logger";
import { supabase } from "@/lib/supabase";
import {
  emptyQueryEntry,
  errorQueryEntry,
  loadingQueryEntry,
  successQueryEntry,
  type QueryEntry,
} from "@/stores/query-state";
import type { InventoryAlert } from "@/types/database.types";

type InventoryAlertsStore = {
  alerts: QueryEntry<InventoryAlert[]>;
  unreadCount: number;
  fetchAlerts: (clinicId: string) => Promise<void>;
  markAsRead: (clinicId: string) => Promise<void>;
  subscribeRealtime: (clinicId: string) => void;
  unsubscribeRealtime: () => void;
};

let inventoryAlertsChannel: RealtimeChannel | null = null;
let inventoryAlertsSubscribers = 0;

export const useInventoryAlertsStore = create<InventoryAlertsStore>(
  (set, get) => ({
    alerts: emptyQueryEntry(),
    unreadCount: 0,

    fetchAlerts: async (clinicId) => {
      set({ alerts: loadingQueryEntry(get().alerts) });

      try {
        const alerts = await getInventoryAlerts(clinicId);
        const unreadCount = alerts.filter((a) => !a.read_at).length;
        set({ alerts: successQueryEntry(alerts), unreadCount });
      } catch (cause) {
        logger.captureException(cause, {
          store: "inventory-alerts-store",
          action: "fetchAlerts",
          clinicId,
        });
        set({
          alerts: errorQueryEntry(
            cause instanceof Error ? cause : new Error(String(cause)),
            get().alerts,
          ),
        });
      }
    },

    subscribeRealtime: (clinicId) => {
      inventoryAlertsSubscribers += 1;

      if (inventoryAlertsChannel) {
        return;
      }

      inventoryAlertsChannel = supabase
        .channel("inventory-alerts-realtime")
        .on(
          "postgres_changes",
          {
            event: "INSERT",
            schema: "public",
            table: "inventory_alerts",
            filter: `clinic_id=eq.${clinicId}`,
          },
          (payload) => {
            const alert = payload.new as InventoryAlert;
            toast.warning(`Stock bajo: ${alert.item_name}`);
            void get().fetchAlerts(clinicId);
          },
        )
        .on(
          "postgres_changes",
          {
            event: "UPDATE",
            schema: "public",
            table: "inventory_alerts",
            filter: `clinic_id=eq.${clinicId}`,
          },
          () => {
            void get().fetchAlerts(clinicId);
          },
        )
        .subscribe();
    },

    markAsRead: async (clinicId) => {
      set({ unreadCount: 0 });
      try {
        await markInventoryAlertsAsRead(clinicId);
        const alerts = get().alerts.data;
        if (alerts) {
          const now = new Date().toISOString();
          set({
            alerts: successQueryEntry(
              alerts.map((a) => (a.read_at ? a : { ...a, read_at: now })),
            ),
          });
        }
      } catch (cause) {
        logger.captureException(cause, {
          store: "inventory-alerts-store",
          action: "markAsRead",
          clinicId,
        });
      }
    },

    unsubscribeRealtime: () => {
      inventoryAlertsSubscribers -= 1;

      if (inventoryAlertsSubscribers > 0) {
        return;
      }

      if (!inventoryAlertsChannel) {
        return;
      }

      supabase.removeChannel(inventoryAlertsChannel);
      inventoryAlertsChannel = null;
    },
  }),
);
