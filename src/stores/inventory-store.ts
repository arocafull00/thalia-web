import { create } from "zustand";

import { getActiveClinicId } from "@/lib/active-clinic-id";
import { supabase } from "@/lib/supabase";
import { unwrapSupabase, unwrapSupabaseList } from "@/lib/supabase-query";
import {
  emptyQueryEntry,
  errorQueryEntry,
  loadingQueryEntry,
  successQueryEntry,
  type QueryEntry,
} from "@/stores/query-state";
import type {
  InventoryItem,
  InventoryMovementType,
  InventoryMovementWithEmployee,
} from "@/types/database.types";

export type InventoryItemInput = {
  clinic_id: string;
  name: string;
  category: string | null;
  unit: string | null;
  stock: number;
  min_stock: number;
  unit_price: number | null;
};

type InventoryStore = {
  list: QueryEntry<InventoryItem[]>;
  byId: Record<string, QueryEntry<InventoryItem>>;
  movementsByItemId: Record<string, QueryEntry<InventoryMovementWithEmployee[]>>;
  creating: boolean;
  createError: Error | null;
  recording: boolean;
  recordError: Error | null;
  fetchInventoryItems: () => Promise<void>;
  fetchInventoryItem: (itemId: string) => Promise<void>;
  fetchInventoryMovements: (itemId: string) => Promise<void>;
  createInventoryItem: (input: InventoryItemInput) => Promise<InventoryItem>;
  recordInventoryMovement: (input: {
    item_id: string;
    employee_id: string;
    type: InventoryMovementType;
    quantity: number;
    notes: string | null;
  }) => Promise<void>;
};

export const useInventoryStore = create<InventoryStore>((set, get) => ({
  list: emptyQueryEntry(),
  byId: {},
  movementsByItemId: {},
  creating: false,
  createError: null,
  recording: false,
  recordError: null,

  fetchInventoryItems: async () => {
    set({ list: loadingQueryEntry(get().list) });

    try {
      const clinicId = getActiveClinicId();
      let query = supabase.from("inventory_items").select("*").order("name");

      if (clinicId) {
        query = query.eq("clinic_id", clinicId);
      }

      const { data, error } = await query;
      const items = unwrapSupabaseList(data, error) as InventoryItem[];
      set({ list: successQueryEntry(items) });
    } catch (cause) {
      set({
        list: errorQueryEntry(
          cause instanceof Error ? cause : new Error(String(cause)),
          get().list,
        ),
      });
    }
  },

  fetchInventoryItem: async (itemId) => {
    const previous = get().byId[itemId];
    set({ byId: { ...get().byId, [itemId]: loadingQueryEntry(previous) } });

    try {
      const { data, error } = await supabase
        .from("inventory_items")
        .select("*")
        .eq("id", itemId)
        .single();
      const item = unwrapSupabase(data, error) as InventoryItem;
      set({ byId: { ...get().byId, [itemId]: successQueryEntry(item) } });
    } catch (cause) {
      set({
        byId: {
          ...get().byId,
          [itemId]: errorQueryEntry(
            cause instanceof Error ? cause : new Error(String(cause)),
            previous,
          ),
        },
      });
    }
  },

  fetchInventoryMovements: async (itemId) => {
    const previous = get().movementsByItemId[itemId];
    set({
      movementsByItemId: { ...get().movementsByItemId, [itemId]: loadingQueryEntry(previous) },
    });

    try {
      const { data, error } = await supabase
        .from("inventory_movements")
        .select("*, employees(id, full_name)")
        .eq("item_id", itemId)
        .order("created_at", { ascending: false });

      const movements = unwrapSupabaseList(data, error) as InventoryMovementWithEmployee[];
      set({
        movementsByItemId: { ...get().movementsByItemId, [itemId]: successQueryEntry(movements) },
      });
    } catch (cause) {
      set({
        movementsByItemId: {
          ...get().movementsByItemId,
          [itemId]: errorQueryEntry(
            cause instanceof Error ? cause : new Error(String(cause)),
            previous,
          ),
        },
      });
    }
  },

  createInventoryItem: async (input) => {
    set({ creating: true, createError: null });

    try {
      const { data, error } = await supabase
        .from("inventory_items")
        .insert(input)
        .select("*")
        .single();
      const item = unwrapSupabase(data, error) as InventoryItem;
      await get().fetchInventoryItems();
      set({ creating: false });
      return item;
    } catch (cause) {
      const error = cause instanceof Error ? cause : new Error(String(cause));
      set({ creating: false, createError: error });
      throw error;
    }
  },

  recordInventoryMovement: async (input) => {
    set({ recording: true, recordError: null });

    try {
      const { error } = await supabase
        .from("inventory_movements")
        .insert(input)
        .select("*")
        .single();
      if (error) {
        throw error;
      }

      await get().fetchInventoryItems();
      await get().fetchInventoryItem(input.item_id);
      await get().fetchInventoryMovements(input.item_id);
      set({ recording: false });
    } catch (cause) {
      const error = cause instanceof Error ? cause : new Error(String(cause));
      set({ recording: false, recordError: error });
      throw error;
    }
  },
}));
