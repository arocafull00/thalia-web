import { create } from "zustand";

import {
  getCampaign,
  getCampaignsPage,
  insertCampaign,
  updateCampaign,
  type CampaignInsert,
  type CampaignPageParams,
  type CampaignPageResult,
  type CampaignUpdate,
} from "@/dal/campaigns.dal";
import { getActiveClinicId } from "@/lib/active-clinic-id";
import { logger } from "@/lib/logger";
import {
  errorQueryEntry,
  loadingQueryEntry,
  successQueryEntry,
  type QueryEntry,
} from "@/stores/query-state";
import type { Campaign } from "@/types/database.types";

export type CampaignsPageQuery = Omit<CampaignPageParams, "clinicId">;

export function campaignsPageKey(query: CampaignsPageQuery) {
  return JSON.stringify({
    search: query.search.trim().toLowerCase(),
    status: query.status,
    createdFrom: query.createdFrom,
    createdTo: query.createdTo,
    page: query.page,
    pageSize: query.pageSize,
  });
}

type CampaignsStore = {
  byPage: Record<string, QueryEntry<CampaignPageResult>>;
  byId: Record<string, QueryEntry<Campaign>>;
  creating: boolean;
  createError: Error | null;
  updating: boolean;
  updateError: Error | null;
  fetchCampaignsPage: (query: CampaignsPageQuery) => Promise<void>;
  seedCampaignsPage: (
    query: CampaignsPageQuery,
    result: CampaignPageResult,
  ) => void;
  refreshCampaignPages: () => Promise<void>;
  fetchCampaign: (campaignId: string) => Promise<void>;
  createCampaign: (input: CampaignInsert) => Promise<Campaign>;
  updateCampaign: (
    campaignId: string,
    input: CampaignUpdate,
  ) => Promise<Campaign>;
};

function toError(cause: unknown): Error {
  return cause instanceof Error ? cause : new Error(String(cause));
}

export const useCampaignsStore = create<CampaignsStore>((set, get) => ({
  byPage: {},
  byId: {},
  creating: false,
  createError: null,
  updating: false,
  updateError: null,

  seedCampaignsPage: (query, result) => {
    const key = campaignsPageKey(query);

    set((state) => {
      // La siembra sólo rellena huecos: si ya hay datos de cliente para esta
      // página, son más frescos que los del servidor.
      if (state.byPage[key]?.data != null) {
        return state;
      }

      return { byPage: { ...state.byPage, [key]: successQueryEntry(result) } };
    });
  },

  fetchCampaignsPage: async (query) => {
    const key = campaignsPageKey(query);
    const previous = get().byPage[key];
    set({ byPage: { ...get().byPage, [key]: loadingQueryEntry(previous) } });

    try {
      const result = await getCampaignsPage({
        ...query,
        clinicId: getActiveClinicId(),
      });
      set({ byPage: { ...get().byPage, [key]: successQueryEntry(result) } });
    } catch (cause) {
      logger.captureException(cause, {
        store: "campaigns-store",
        action: "fetchCampaignsPage",
        clinicId: getActiveClinicId(),
      });
      set({
        byPage: {
          ...get().byPage,
          [key]: errorQueryEntry(toError(cause), previous),
        },
      });
    }
  },

  /**
   * Vuelve a pedir todas las páginas en caché. Hace falta tras cualquier
   * mutación: crear o duplicar cambia el total —«1-10 de 40» pasa a «de 41»— y
   * enviar cambia el `status`, que además es filtrable. Parchear la campaña en
   * memoria no arreglaría ninguna de las dos cosas.
   */
  refreshCampaignPages: async () => {
    const { byPage, fetchCampaignsPage } = get();

    await Promise.all(
      Object.keys(byPage).map((key) =>
        fetchCampaignsPage(JSON.parse(key) as CampaignsPageQuery),
      ),
    );
  },

  fetchCampaign: async (campaignId) => {
    const previous = get().byId[campaignId];
    set({ byId: { ...get().byId, [campaignId]: loadingQueryEntry(previous) } });

    try {
      const campaign = await getCampaign(campaignId);
      set({
        byId: { ...get().byId, [campaignId]: successQueryEntry(campaign) },
      });
    } catch (cause) {
      logger.captureException(cause, {
        store: "campaigns-store",
        action: "fetchCampaign",
        campaignId,
      });
      set({
        byId: {
          ...get().byId,
          [campaignId]: errorQueryEntry(toError(cause), previous),
        },
      });
    }
  },

  createCampaign: async (input) => {
    set({ creating: true, createError: null });

    try {
      const campaign = await insertCampaign(input);
      set({
        byId: { ...get().byId, [campaign.id]: successQueryEntry(campaign) },
      });
      await get().refreshCampaignPages();
      set({ creating: false });
      return campaign;
    } catch (cause) {
      logger.captureException(cause, {
        store: "campaigns-store",
        action: "createCampaign",
      });
      const error = toError(cause);
      set({ creating: false, createError: error });
      throw error;
    }
  },

  updateCampaign: async (campaignId, input) => {
    set({ updating: true, updateError: null });

    try {
      const campaign = await updateCampaign(campaignId, input);
      set({
        byId: { ...get().byId, [campaignId]: successQueryEntry(campaign) },
      });
      await get().refreshCampaignPages();
      set({ updating: false });
      return campaign;
    } catch (cause) {
      logger.captureException(cause, {
        store: "campaigns-store",
        action: "updateCampaign",
        campaignId,
      });
      const error = toError(cause);
      set({ updating: false, updateError: error });
      throw error;
    }
  },
}));
