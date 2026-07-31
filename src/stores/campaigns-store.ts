import { create } from "zustand";

import {
  getCampaign,
  getCampaigns,
  insertCampaign,
  updateCampaign,
  type CampaignInsert,
  type CampaignUpdate,
} from "@/dal/campaigns.dal";
import { getActiveClinicId } from "@/lib/active-clinic-id";
import { logger } from "@/lib/logger";
import {
  emptyQueryEntry,
  errorQueryEntry,
  loadingQueryEntry,
  successQueryEntry,
  type QueryEntry,
} from "@/stores/query-state";
import type { Campaign } from "@/types/database.types";

type CampaignsStore = {
  list: QueryEntry<Campaign[]>;
  byId: Record<string, QueryEntry<Campaign>>;
  creating: boolean;
  createError: Error | null;
  updating: boolean;
  updateError: Error | null;
  fetchCampaigns: () => Promise<void>;
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
  list: emptyQueryEntry(),
  byId: {},
  creating: false,
  createError: null,
  updating: false,
  updateError: null,

  fetchCampaigns: async () => {
    set({ list: loadingQueryEntry(get().list) });

    try {
      const clinicId = getActiveClinicId();
      const campaigns = await getCampaigns(clinicId);
      set({ list: successQueryEntry(campaigns) });
    } catch (cause) {
      logger.captureException(cause, {
        store: "campaigns-store",
        action: "fetchCampaigns",
        clinicId: getActiveClinicId(),
      });
      set({ list: errorQueryEntry(toError(cause), get().list) });
    }
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
      const current = get().list.data ?? [];
      set({
        creating: false,
        list: successQueryEntry([campaign, ...current]),
        byId: { ...get().byId, [campaign.id]: successQueryEntry(campaign) },
      });
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
      const current = get().list.data ?? [];
      set({
        updating: false,
        list: successQueryEntry(
          current.map((entry) => (entry.id === campaignId ? campaign : entry)),
        ),
        byId: { ...get().byId, [campaignId]: successQueryEntry(campaign) },
      });
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
