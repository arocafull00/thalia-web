import { create } from "zustand";

import {
  deleteTreatment,
  getTreatment,
  getTreatments,
  insertTreatment,
  replaceTreatmentInventoryLinks,
  updateTreatment,
} from "@/dal/treatments.dal";
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

type TreatmentStore = {
  list: QueryEntry<TreatmentWithInventory[]>;
  byId: Record<string, QueryEntry<TreatmentWithInventory>>;
  creating: boolean;
  createError: Error | null;
  updating: boolean;
  updateError: Error | null;
  deleting: boolean;
  deleteError: Error | null;
  fetchTreatments: () => Promise<void>;
  fetchTreatment: (treatmentId: string) => Promise<void>;
  createTreatment: (input: TreatmentInput) => Promise<TreatmentWithInventory>;
  updateTreatment: (
    treatmentId: string,
    input: TreatmentUpdateInput,
  ) => Promise<TreatmentWithInventory>;
  deleteTreatment: (treatmentId: string) => Promise<void>;
};

export const useTreatmentStore = create<TreatmentStore>((set, get) => ({
  list: emptyQueryEntry(),
  byId: {},
  creating: false,
  createError: null,
  updating: false,
  updateError: null,
  deleting: false,
  deleteError: null,

  fetchTreatments: async () => {
    set({ list: loadingQueryEntry(get().list) });

    try {
      const treatments = await getTreatments();
      set({ list: successQueryEntry(treatments) });
    } catch (cause) {
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

      await get().fetchTreatments();
      set({ creating: false });
      return treatmentWithInventory;
    } catch (cause) {
      if (createdTreatmentId) {
        await deleteTreatment(createdTreatmentId).catch(() => {});
      }

      const error = cause instanceof Error ? cause : new Error(String(cause));
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

      await get().fetchTreatments();
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

      await get().fetchTreatments();
      set({ byId: nextById, deleting: false });
    } catch (cause) {
      const error = cause instanceof Error ? cause : new Error(String(cause));
      set({ deleting: false, deleteError: error });
      throw error;
    }
  },
}));
