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
import type { TreatmentType, TreatmentTypeWithInventory } from "@/types/database.types";

export type TreatmentInventoryLinkInput = {
  inventory_item_id: string;
  quantity: number;
};

export type TreatmentTypeInput = {
  clinic_id: string;
  name: string;
  category: string | null;
  duration_minutes: number;
  price: number | null;
  inventoryLinks: TreatmentInventoryLinkInput[];
};

export type TreatmentTypeUpdateInput = Omit<TreatmentTypeInput, "clinic_id">;

const treatmentTypeDetailSelect =
  "*, treatment_type_inventory_items(*, inventory_items(id, name, unit))";

async function replaceTreatmentInventoryLinks(
  treatmentTypeId: string,
  links: TreatmentInventoryLinkInput[],
) {
  const { error: deleteError } = await supabase
    .from("treatment_type_inventory_items")
    .delete()
    .eq("treatment_type_id", treatmentTypeId);

  if (deleteError) {
    throw deleteError;
  }

  if (links.length === 0) {
    return;
  }

  const rows = links.map((link) => ({
    treatment_type_id: treatmentTypeId,
    inventory_item_id: link.inventory_item_id,
    quantity: link.quantity,
  }));

  const { error: insertError } = await supabase.from("treatment_type_inventory_items").insert(rows);

  if (insertError) {
    throw insertError;
  }
}

type TreatmentTypesStore = {
  list: QueryEntry<TreatmentType[]>;
  byId: Record<string, QueryEntry<TreatmentTypeWithInventory>>;
  creating: boolean;
  createError: Error | null;
  updating: boolean;
  updateError: Error | null;
  fetchTreatmentTypes: () => Promise<void>;
  fetchTreatmentType: (treatmentTypeId: string) => Promise<void>;
  createTreatmentType: (input: TreatmentTypeInput) => Promise<TreatmentTypeWithInventory>;
  updateTreatmentType: (
    treatmentTypeId: string,
    input: TreatmentTypeUpdateInput,
  ) => Promise<TreatmentTypeWithInventory>;
};

export const useTreatmentTypesStore = create<TreatmentTypesStore>((set, get) => ({
  list: emptyQueryEntry(),
  byId: {},
  creating: false,
  createError: null,
  updating: false,
  updateError: null,

  fetchTreatmentTypes: async () => {
    set({ list: loadingQueryEntry(get().list) });

    try {
      const { data, error } = await supabase.from("treatment_types").select("*").order("name");
      const treatmentTypes = unwrapSupabaseList(data, error) as TreatmentType[];
      set({ list: successQueryEntry(treatmentTypes) });
    } catch (cause) {
      set({
        list: errorQueryEntry(
          cause instanceof Error ? cause : new Error(String(cause)),
          get().list,
        ),
      });
    }
  },

  fetchTreatmentType: async (treatmentTypeId) => {
    const previous = get().byId[treatmentTypeId];
    set({ byId: { ...get().byId, [treatmentTypeId]: loadingQueryEntry(previous) } });

    try {
      const { data, error } = await supabase
        .from("treatment_types")
        .select(treatmentTypeDetailSelect)
        .eq("id", treatmentTypeId)
        .single();
      const treatmentType = unwrapSupabase(data, error) as TreatmentTypeWithInventory;
      set({ byId: { ...get().byId, [treatmentTypeId]: successQueryEntry(treatmentType) } });
    } catch (cause) {
      set({
        byId: {
          ...get().byId,
          [treatmentTypeId]: errorQueryEntry(
            cause instanceof Error ? cause : new Error(String(cause)),
            previous,
          ),
        },
      });
    }
  },

  createTreatmentType: async (input) => {
    set({ creating: true, createError: null });

    const { inventoryLinks, ...treatmentInput } = input;
    let createdTreatmentId: string | null = null;

    try {
      const { data, error } = await supabase
        .from("treatment_types")
        .insert(treatmentInput)
        .select("*")
        .single();
      const treatmentType = unwrapSupabase(data, error) as TreatmentType;
      createdTreatmentId = treatmentType.id;

      await replaceTreatmentInventoryLinks(treatmentType.id, inventoryLinks);

      const { data: detailData, error: detailError } = await supabase
        .from("treatment_types")
        .select(treatmentTypeDetailSelect)
        .eq("id", treatmentType.id)
        .single();
      const treatmentWithInventory = unwrapSupabase(
        detailData,
        detailError,
      ) as TreatmentTypeWithInventory;

      await get().fetchTreatmentTypes();
      set({ creating: false });
      return treatmentWithInventory;
    } catch (cause) {
      if (createdTreatmentId) {
        await supabase.from("treatment_types").delete().eq("id", createdTreatmentId);
      }

      const error = cause instanceof Error ? cause : new Error(String(cause));
      set({ creating: false, createError: error });
      throw error;
    }
  },

  updateTreatmentType: async (treatmentTypeId, input) => {
    set({ updating: true, updateError: null });

    const { inventoryLinks, ...treatmentInput } = input;

    try {
      const { data, error } = await supabase
        .from("treatment_types")
        .update(treatmentInput)
        .eq("id", treatmentTypeId)
        .select("*")
        .single();
      unwrapSupabase(data, error);

      await replaceTreatmentInventoryLinks(treatmentTypeId, inventoryLinks);

      const { data: detailData, error: detailError } = await supabase
        .from("treatment_types")
        .select(treatmentTypeDetailSelect)
        .eq("id", treatmentTypeId)
        .single();
      const treatmentWithInventory = unwrapSupabase(
        detailData,
        detailError,
      ) as TreatmentTypeWithInventory;

      await get().fetchTreatmentTypes();
      set({
        byId: { ...get().byId, [treatmentTypeId]: successQueryEntry(treatmentWithInventory) },
        updating: false,
      });
      return treatmentWithInventory;
    } catch (cause) {
      const error = cause instanceof Error ? cause : new Error(String(cause));
      set({ updating: false, updateError: error });
      throw error;
    }
  },
}));
