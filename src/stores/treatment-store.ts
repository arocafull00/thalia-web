import { create } from "zustand";

import {
  deleteTreatment,
  getTreatment,
  getTreatmentCategories,
  getTreatments,
  getTreatmentsPage,
  insertTreatment,
  replaceTreatmentInventoryLinks,
  updateTreatment,
  type TreatmentPageParams,
  type TreatmentPageResult,
} from "@/dal/treatments.dal";
import { getActiveClinicId } from "@/lib/active-clinic-id";
import { logger } from "@/lib/logger";
import {
  emptyQueryEntry,
  errorQueryEntry,
  loadingQueryEntry,
  successQueryEntry,
  type QueryEntry,
} from "@/stores/query-state";
import type { TreatmentWithInventory } from "@/types/database.types";

export type TreatmentInventoryLinkInput = {
  inventory_item_id: string;
  quantity: number;
};

export type TreatmentInput = {
  clinic_id: string;
  name: string;
  category: string | null;
  duration_minutes: number;
  price: number | null;
  color: string | null;
  inventoryLinks: TreatmentInventoryLinkInput[];
};

export type TreatmentUpdateInput = Omit<TreatmentInput, "clinic_id">;

export type TreatmentsPageQuery = Omit<TreatmentPageParams, "clinicId">;

export function treatmentsPageKey(query: TreatmentsPageQuery) {
  return JSON.stringify({
    category: query.category,
    search: query.search.trim().toLowerCase(),
    page: query.page,
    pageSize: query.pageSize,
  });
}

type TreatmentStore = {
  list: QueryEntry<TreatmentWithInventory[]>;
  byPage: Record<string, QueryEntry<TreatmentPageResult>>;
  // Las categorías se piden aparte: derivarlas de la página visible mostraría
  // sólo las de esas filas y no se podría filtrar por el resto.
  categories: QueryEntry<string[]>;
  byId: Record<string, QueryEntry<TreatmentWithInventory>>;
  creating: boolean;
  createError: Error | null;
  updating: boolean;
  updateError: Error | null;
  deleting: boolean;
  deleteError: Error | null;
  fetchTreatments: () => Promise<void>;
  fetchTreatmentsPage: (query: TreatmentsPageQuery) => Promise<void>;
  seedTreatmentsPage: (
    query: TreatmentsPageQuery,
    result: TreatmentPageResult,
  ) => void;
  fetchTreatmentCategories: () => Promise<void>;
  fetchTreatment: (treatmentId: string) => Promise<void>;
  createTreatment: (input: TreatmentInput) => Promise<TreatmentWithInventory>;
  updateTreatment: (
    treatmentId: string,
    input: TreatmentUpdateInput,
  ) => Promise<TreatmentWithInventory>;
  deleteTreatment: (treatmentId: string) => Promise<void>;
};

/**
 * Refresco tras crear, editar o borrar. Vuelve a pedir todas las páginas en
 * caché y las categorías, además de la lista completa que siguen usando otras
 * pantallas (el selector de tratamientos al crear una cita, por ejemplo).
 *
 * Hace falta releer el total: si se borra una fila, «1-10 de 40» pasa a «de
 * 39», y parchear el elemento en memoria no lo actualizaría. Las categorías
 * también cambian si el tratamiento creado estrena una.
 */
async function refreshTreatmentQueries(get: () => TreatmentStore) {
  const {
    byPage,
    fetchTreatments,
    fetchTreatmentsPage,
    fetchTreatmentCategories,
  } = get();

  await Promise.all([
    fetchTreatments(),
    fetchTreatmentCategories(),
    ...Object.keys(byPage).map((key) =>
      fetchTreatmentsPage(JSON.parse(key) as TreatmentsPageQuery),
    ),
  ]);
}

export const useTreatmentStore = create<TreatmentStore>((set, get) => ({
  list: emptyQueryEntry(),
  byPage: {},
  categories: emptyQueryEntry(),
  byId: {},
  creating: false,
  createError: null,
  updating: false,
  updateError: null,
  deleting: false,
  deleteError: null,

  seedTreatmentsPage: (query, result) => {
    const key = treatmentsPageKey(query);

    set((state) => {
      // La siembra sólo rellena huecos: si ya hay datos de cliente para esta
      // página, son más frescos que los del servidor.
      if (state.byPage[key]?.data != null) {
        return state;
      }

      return { byPage: { ...state.byPage, [key]: successQueryEntry(result) } };
    });
  },

  fetchTreatmentsPage: async (query) => {
    const key = treatmentsPageKey(query);
    const previous = get().byPage[key];
    set({ byPage: { ...get().byPage, [key]: loadingQueryEntry(previous) } });

    try {
      const result = await getTreatmentsPage({
        ...query,
        clinicId: getActiveClinicId(),
      });
      set({ byPage: { ...get().byPage, [key]: successQueryEntry(result) } });
    } catch (cause) {
      logger.captureException(cause, {
        store: "treatment-store",
        action: "fetchTreatmentsPage",
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

  fetchTreatmentCategories: async () => {
    set({ categories: loadingQueryEntry(get().categories) });

    try {
      const categories = await getTreatmentCategories(getActiveClinicId());
      set({ categories: successQueryEntry(categories) });
    } catch (cause) {
      logger.captureException(cause, {
        store: "treatment-store",
        action: "fetchTreatmentCategories",
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

  fetchTreatments: async () => {
    set({ list: loadingQueryEntry(get().list) });

    try {
      const clinicId = getActiveClinicId();
      const treatments = await getTreatments(clinicId);
      set({ list: successQueryEntry(treatments) });
    } catch (cause) {
      logger.captureException(cause, {
        store: "treatment-store",
        action: "fetchTreatments",
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

  fetchTreatment: async (treatmentId) => {
    const previous = get().byId[treatmentId];
    set({
      byId: { ...get().byId, [treatmentId]: loadingQueryEntry(previous) },
    });

    try {
      const treatment = await getTreatment(treatmentId);
      set({
        byId: { ...get().byId, [treatmentId]: successQueryEntry(treatment) },
      });
    } catch (cause) {
      logger.captureException(cause, {
        store: "treatment-store",
        action: "fetchTreatment",
        treatmentId,
      });
      set({
        byId: {
          ...get().byId,
          [treatmentId]: errorQueryEntry(
            cause instanceof Error ? cause : new Error(String(cause)),
            previous,
          ),
        },
      });
    }
  },

  createTreatment: async (input) => {
    set({ creating: true, createError: null });

    const { inventoryLinks, ...treatmentInput } = input;
    let createdTreatmentId: string | null = null;

    try {
      const treatment = await insertTreatment(treatmentInput);
      createdTreatmentId = treatment.id;

      await replaceTreatmentInventoryLinks(treatment.id, inventoryLinks);

      const treatmentWithInventory = await getTreatment(treatment.id);

      await refreshTreatmentQueries(get);
      set({ creating: false });
      return treatmentWithInventory;
    } catch (cause) {
      if (createdTreatmentId) {
        await deleteTreatment(createdTreatmentId).catch(() => {});
      }

      const error = cause instanceof Error ? cause : new Error(String(cause));
      logger.captureException(error, {
        store: "treatment-store",
        action: "createTreatment",
        clinicId: input.clinic_id,
      });
      set({ creating: false, createError: error });
      throw error;
    }
  },

  updateTreatment: async (treatmentId, input) => {
    set({ updating: true, updateError: null });

    const { inventoryLinks, ...treatmentInput } = input;

    try {
      await updateTreatment(treatmentId, treatmentInput);
      await replaceTreatmentInventoryLinks(treatmentId, inventoryLinks);

      const treatmentWithInventory = await getTreatment(treatmentId);

      await refreshTreatmentQueries(get);
      set({
        byId: {
          ...get().byId,
          [treatmentId]: successQueryEntry(treatmentWithInventory),
        },
        updating: false,
      });
      return treatmentWithInventory;
    } catch (cause) {
      const error = cause instanceof Error ? cause : new Error(String(cause));
      logger.captureException(error, {
        store: "treatment-store",
        action: "updateTreatment",
        treatmentId,
      });
      set({ updating: false, updateError: error });
      throw error;
    }
  },

  deleteTreatment: async (treatmentId) => {
    set({ deleting: true, deleteError: null });

    try {
      await deleteTreatment(treatmentId);

      const nextById = { ...get().byId };
      delete nextById[treatmentId];

      await refreshTreatmentQueries(get);
      set({ byId: nextById, deleting: false });
    } catch (cause) {
      const error = cause instanceof Error ? cause : new Error(String(cause));
      logger.captureException(error, {
        store: "treatment-store",
        action: "deleteTreatment",
        treatmentId,
      });
      set({ deleting: false, deleteError: error });
      throw error;
    }
  },
}));
