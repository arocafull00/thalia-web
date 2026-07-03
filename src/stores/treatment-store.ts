import { create } from "zustand";

import { supabase } from "@/lib/supabase";
import { unwrapSupabase, unwrapSupabaseList } from "@/lib/supabase-query";
import {
  emptyQueryEntry,
  errorQueryEntry,
  loadingQueryEntry,
  successQueryEntry,
  type QueryEntry,
} from "@/stores/query-state";
import type { Treatment, TreatmentWithInventory } from "@/types/database.types";

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

const treatmentDetailSelect =
  "*, treatment_inventory_items(*, inventory_items(id, name, unit))";

async function replaceTreatmentInventoryLinks(
  treatmentId: string,
  links: TreatmentInventoryLinkInput[],
) {
  const { error: deleteError } = await supabase
    .from("treatment_inventory_items")
    .delete()
    .eq("treatment_id", treatmentId);

  if (deleteError) {
    throw deleteError;
  }

  if (links.length === 0) {
    return;
  }

  const rows = links.map((link) => ({
    treatment_id: treatmentId,
    inventory_item_id: link.inventory_item_id,
    quantity: link.quantity,
  }));

  const { error: insertError } = await supabase
    .from("treatment_inventory_items")
    .insert(rows);

  if (insertError) {
    throw insertError;
  }
}

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
      const { data, error } = await supabase
        .from("treatment")
        .select("*, treatment_inventory_items(id)")
        .order("name");
      const treatments = unwrapSupabaseList(
        data,
        error,
      ) as TreatmentWithInventory[];
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
      const { data, error } = await supabase
        .from("treatment")
        .select(treatmentDetailSelect)
        .eq("id", treatmentId)
        .single();
      const treatment = unwrapSupabase(data, error) as TreatmentWithInventory;
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
      const { data, error } = await supabase
        .from("treatment")
        .insert(treatmentInput)
        .select("*")
        .single();
      const treatment = unwrapSupabase(data, error) as Treatment;
      createdTreatmentId = treatment.id;

      await replaceTreatmentInventoryLinks(treatment.id, inventoryLinks);

      const { data: detailData, error: detailError } = await supabase
        .from("treatment")
        .select(treatmentDetailSelect)
        .eq("id", treatment.id)
        .single();
      const treatmentWithInventory = unwrapSupabase(
        detailData,
        detailError,
      ) as TreatmentWithInventory;

      await get().fetchTreatments();
      set({ creating: false });
      return treatmentWithInventory;
    } catch (cause) {
      if (createdTreatmentId) {
        await supabase.from("treatment").delete().eq("id", createdTreatmentId);
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
      const { data, error } = await supabase
        .from("treatment")
        .update(treatmentInput)
        .eq("id", treatmentId)
        .select("*")
        .single();
      unwrapSupabase(data, error);

      await replaceTreatmentInventoryLinks(treatmentId, inventoryLinks);

      const { data: detailData, error: detailError } = await supabase
        .from("treatment")
        .select(treatmentDetailSelect)
        .eq("id", treatmentId)
        .single();
      const treatmentWithInventory = unwrapSupabase(
        detailData,
        detailError,
      ) as TreatmentWithInventory;

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
      const { error } = await supabase
        .from("treatment")
        .delete()
        .eq("id", treatmentId);

      if (error) {
        const message =
          error.code === "23503"
            ? "No se puede eliminar: el tratamiento tiene citas asociadas."
            : error.message;
        throw new Error(message);
      }

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
