import { create } from "zustand";

import {
  getInventoryCategories,
  getInventoryItem,
  getInventoryItems,
  getInventoryItemsPage,
  getInventoryMovements,
  getInventoryStockSummary,
  insertInventoryItem,
  insertInventoryMovement,
  updateInventoryItem,
  type InventoryPageParams,
  type InventoryPageResult,
  type InventoryStockSummary,
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

export type InventoryPageQuery = Omit<InventoryPageParams, "clinicId">;

export function inventoryPageKey(query: InventoryPageQuery) {
  return JSON.stringify({
    search: query.search.trim().toLowerCase(),
    category: query.category,
    stockLevel: query.stockLevel,
    page: query.page,
    pageSize: query.pageSize,
  });
}

type InventoryStore = {
  /**
   * Lista completa de la clínica. **No** se sustituye por `byPage`: la
   * consumen el selector de materiales de tratamientos y el de consumo en
   * citas, que necesitan todo el inventario para sus desplegables.
   */
  list: QueryEntry<InventoryItem[]>;
  byPage: Record<string, QueryEntry<InventoryPageResult>>;
  categories: QueryEntry<string[]>;
  summary: QueryEntry<InventoryStockSummary>;
  byId: Record<string, QueryEntry<InventoryItem>>;
  movementsByItemId: Record<
    string,
    QueryEntry<InventoryMovementWithEmployee[]>
  >;
  creating: boolean;
  createError: Error | null;
  recording: boolean;
  recordError: Error | null;
  updating: boolean;
  updateError: Error | null;
  fetchInventoryItems: () => Promise<void>;
  fetchInventoryItemsPage: (query: InventoryPageQuery) => Promise<void>;
  seedInventoryItemsPage: (
    query: InventoryPageQuery,
    result: InventoryPageResult,
  ) => void;
  fetchInventoryCategories: () => Promise<void>;
  seedInventoryCategories: (categories: string[]) => void;
  fetchInventoryStockSummary: () => Promise<void>;
  seedInventoryStockSummary: (summary: InventoryStockSummary) => void;
  fetchInventoryItem: (itemId: string) => Promise<void>;
  fetchInventoryMovements: (itemId: string) => Promise<void>;
  createInventoryItem: (input: InventoryItemInput) => Promise<InventoryItem>;
  updateInventoryItem: (
    itemId: string,
    input: Omit<InventoryItemInput, "clinic_id">,
  ) => Promise<InventoryItem>;
  recordInventoryMovement: (input: {
    item_id: string;
    employee_id: string;
    type: InventoryMovementType;
    quantity: number;
    notes: string | null;
  }) => Promise<void>;
};

/**
 * Refresco tras crear, editar o mover stock. Vuelve a pedir las páginas en
 * caché, las categorías, el resumen y la lista completa que usan otras
 * pantallas.
 *
 * Hace falta releer el total y el resumen: un movimiento puede cambiar el
 * `stock_level` del material y moverlo de una tarjeta a otra —y de un filtro a
 * otro— además de alterar «1-10 de 40».
 */
async function refreshInventoryQueries(get: () => InventoryStore) {
  const {
    byPage,
    fetchInventoryCategories,
    fetchInventoryItems,
    fetchInventoryItemsPage,
    fetchInventoryStockSummary,
  } = get();

  await Promise.all([
    fetchInventoryItems(),
    fetchInventoryCategories(),
    fetchInventoryStockSummary(),
    ...Object.keys(byPage).map((key) =>
      fetchInventoryItemsPage(JSON.parse(key) as InventoryPageQuery),
    ),
  ]);
}

export const useInventoryStore = create<InventoryStore>((set, get) => ({
  list: emptyQueryEntry(),
  byPage: {},
  categories: emptyQueryEntry(),
  summary: emptyQueryEntry(),
  byId: {},
  movementsByItemId: {},
  creating: false,
  createError: null,
  recording: false,
  recordError: null,
  updating: false,
  updateError: null,

  seedInventoryItemsPage: (query, result) => {
    const key = inventoryPageKey(query);

    set((state) => {
      // La siembra sólo rellena huecos: si ya hay datos de cliente para esta
      // página, son más frescos que los del servidor.
      if (state.byPage[key]?.data != null) {
        return state;
      }

      return { byPage: { ...state.byPage, [key]: successQueryEntry(result) } };
    });
  },

  fetchInventoryItemsPage: async (query) => {
    const key = inventoryPageKey(query);
    const previous = get().byPage[key];
    set({ byPage: { ...get().byPage, [key]: loadingQueryEntry(previous) } });

    try {
      const result = await getInventoryItemsPage({
        ...query,
        clinicId: getActiveClinicId(),
      });
      set({ byPage: { ...get().byPage, [key]: successQueryEntry(result) } });
    } catch (cause) {
      logger.captureException(cause, {
        store: "inventory-store",
        action: "fetchInventoryItemsPage",
        clinicId: getActiveClinicId(),
      });
      set({
        byPage: {
          ...get().byPage,
          [key]: errorQueryEntry(
            cause instanceof Error ? cause : new Error(String(cause)),
            previous,
          ),
        },
      });
    }
  },

  seedInventoryCategories: (categories) => {
    set((state) =>
      state.categories.data != null
        ? state
        : { categories: successQueryEntry(categories) },
    );
  },

  fetchInventoryCategories: async () => {
    set({ categories: loadingQueryEntry(get().categories) });

    try {
      const categories = await getInventoryCategories(getActiveClinicId());
      set({ categories: successQueryEntry(categories) });
    } catch (cause) {
      logger.captureException(cause, {
        store: "inventory-store",
        action: "fetchInventoryCategories",
        clinicId: getActiveClinicId(),
      });
      set({
        categories: errorQueryEntry(
          cause instanceof Error ? cause : new Error(String(cause)),
          get().categories,
        ),
      });
    }
  },

  seedInventoryStockSummary: (summary) => {
    set((state) =>
      state.summary.data != null
        ? state
        : { summary: successQueryEntry(summary) },
    );
  },

  fetchInventoryStockSummary: async () => {
    set({ summary: loadingQueryEntry(get().summary) });

    try {
      const summary = await getInventoryStockSummary(getActiveClinicId());
      set({ summary: successQueryEntry(summary) });
    } catch (cause) {
      logger.captureException(cause, {
        store: "inventory-store",
        action: "fetchInventoryStockSummary",
        clinicId: getActiveClinicId(),
      });
      set({
        summary: errorQueryEntry(
          cause instanceof Error ? cause : new Error(String(cause)),
          get().summary,
        ),
      });
    }
  },

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
      await refreshInventoryQueries(get);
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

  updateInventoryItem: async (itemId, input) => {
    set({ updating: true, updateError: null });

    try {
      const item = await updateInventoryItem(itemId, input);
      await refreshInventoryQueries(get);
      await get().fetchInventoryItem(itemId);
      set({ updating: false });
      return item;
    } catch (cause) {
      const error = cause instanceof Error ? cause : new Error(String(cause));
      logger.captureException(error, {
        store: "inventory-store",
        action: "updateInventoryItem",
        itemId,
      });
      set({ updating: false, updateError: error });
      throw error;
    }
  },

  recordInventoryMovement: async (input) => {
    set({ recording: true, recordError: null });

    try {
      await insertInventoryMovement(input);

      await refreshInventoryQueries(get);
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
