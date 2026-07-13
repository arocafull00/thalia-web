import { create } from "zustand";

import {
  getInventoryItem,
  getInventoryItems,
  getInventoryMovements,
  insertInventoryItem,
  insertInventoryMovement,
} from "@/dal/inventory.dal";
import { getActiveClinicId } from "@/lib/active-clinic-id";
import { logger } from "@/lib/logger";
import { inventorySchema } from "@/lib/schemas/inventory-schema";
import { formatZodError } from "@/lib/schemas/schema-helpers";
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
  movementsByItemId: Record<
    string,
    QueryEntry<InventoryMovementWithEmployee[]>
  >;
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
      const items = await getInventoryItems(clinicId);
      set({ list: successQueryEntry(items) });
    } catch (cause) {
      logger.captureException(cause, {
        store: "inventory-store",
        action: "fetchInventoryItems",
        clinicId: getActiveClinicId(),
      });
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
      const item = await getInventoryItem(itemId);
      set({ byId: { ...get().byId, [itemId]: successQueryEntry(item) } });
    } catch (cause) {
      logger.captureException(cause, {
        store: "inventory-store",
        action: "fetchInventoryItem",
        itemId,
      });
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
      movementsByItemId: {
        ...get().movementsByItemId,
        [itemId]: loadingQueryEntry(previous),
      },
    });

    try {
      const movements = await getInventoryMovements(itemId);
      set({
        movementsByItemId: {
          ...get().movementsByItemId,
          [itemId]: successQueryEntry(movements),
        },
      });
    } catch (cause) {
      logger.captureException(cause, {
        store: "inventory-store",
        action: "fetchInventoryMovements",
        itemId,
      });
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
      const parsed = inventorySchema.safeParse(input);

      if (!parsed.success) {
        throw new Error(formatZodError(parsed.error));
      }

      const item = await insertInventoryItem(parsed.data);
      await get().fetchInventoryItems();
      set({ creating: false });
      return item;
    } catch (cause) {
      const error = cause instanceof Error ? cause : new Error(String(cause));
      logger.captureException(error, {
        store: "inventory-store",
        action: "createInventoryItem",
        clinicId: input.clinic_id,
      });
      set({ creating: false, createError: error });
      throw error;
    }
  },

  recordInventoryMovement: async (input) => {
    set({ recording: true, recordError: null });

    try {
      await insertInventoryMovement(input);

      await get().fetchInventoryItems();
      await get().fetchInventoryItem(input.item_id);
      await get().fetchInventoryMovements(input.item_id);
      set({ recording: false });
    } catch (cause) {
      const error = cause instanceof Error ? cause : new Error(String(cause));
      logger.captureException(error, {
        store: "inventory-store",
        action: "recordInventoryMovement",
        itemId: input.item_id,
        employeeId: input.employee_id,
      });
      set({ recording: false, recordError: error });
      throw error;
    }
  },
}));
