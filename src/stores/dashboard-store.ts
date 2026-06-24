import { endOfDay, endOfWeek, startOfDay, startOfWeek } from "date-fns";
import { create } from "zustand";

import { getActiveClinicId } from "@/lib/active-clinic-id";
import { supabase } from "@/lib/supabase";
import { unwrapSupabaseList } from "@/lib/supabase-query";
import {
  emptyQueryEntry,
  errorQueryEntry,
  loadingQueryEntry,
  successQueryEntry,
  type QueryEntry,
} from "@/stores/query-state";
import type {
  AppointmentWithRelations,
  InventoryItem,
  Transaction,
} from "@/types/database.types";

export type DashboardData = {
  appointments: AppointmentWithRelations[];
  lowStock: InventoryItem[];
  weeklyNet: number;
};

type DashboardStore = {
  data: QueryEntry<DashboardData>;
  fetchDashboard: () => Promise<void>;
};

export const useDashboardStore = create<DashboardStore>((set, get) => ({
  data: emptyQueryEntry(),

  fetchDashboard: async () => {
    set({ data: loadingQueryEntry(get().data) });

    try {
      const todayStart = startOfDay(new Date()).toISOString();
      const todayEnd = endOfDay(new Date()).toISOString();
      const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 }).toISOString().slice(0, 10);
      const weekEnd = endOfWeek(new Date(), { weekStartsOn: 1 }).toISOString().slice(0, 10);

      const clinicId = getActiveClinicId();
      let appointmentsQuery = supabase
        .from("appointments")
        .select(
          "*, patients(id, full_name, phone), employees(id, full_name, color), appointment_treatments(*, treatment_types(id, name, color, price))",
        )
        .gte("starts_at", todayStart)
        .lte("starts_at", todayEnd)
        .order("starts_at");
      let inventoryQuery = supabase
        .from("inventory_items")
        .select("*")
        .lte("stock", 999999)
        .order("name");
      let transactionsQuery = supabase
        .from("transactions")
        .select("*")
        .gte("date", weekStart)
        .lte("date", weekEnd);

      if (clinicId) {
        appointmentsQuery = appointmentsQuery.eq("clinic_id", clinicId);
        inventoryQuery = inventoryQuery.eq("clinic_id", clinicId);
        transactionsQuery = transactionsQuery.eq("clinic_id", clinicId);
      }

      const [appointmentsResponse, inventoryResponse, transactionsResponse] = await Promise.all([
        appointmentsQuery,
        inventoryQuery,
        transactionsQuery,
      ]);

      const appointments = unwrapSupabaseList(
        appointmentsResponse.data,
        appointmentsResponse.error,
      ) as AppointmentWithRelations[];
      const inventoryItems = unwrapSupabaseList(
        inventoryResponse.data,
        inventoryResponse.error,
      ) as InventoryItem[];
      const transactions = unwrapSupabaseList(
        transactionsResponse.data,
        transactionsResponse.error,
      ) as Transaction[];
      const lowStock = inventoryItems.filter(
        (item) => Number(item.stock ?? 0) <= Number(item.min_stock ?? 0),
      );
      const income = transactions
        .filter((transaction) => transaction.type === "income")
        .reduce((total, transaction) => total + transaction.amount, 0);
      const expenses = transactions
        .filter((transaction) => transaction.type === "expense")
        .reduce((total, transaction) => total + transaction.amount, 0);

      set({
        data: successQueryEntry({
          appointments,
          lowStock,
          weeklyNet: income - expenses,
        }),
      });
    } catch (cause) {
      set({
        data: errorQueryEntry(
          cause instanceof Error ? cause : new Error(String(cause)),
          get().data,
        ),
      });
    }
  },
}));
