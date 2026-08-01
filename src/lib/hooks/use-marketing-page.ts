import { useMemo } from "react";

import { useCampaigns } from "@/lib/hooks/use-campaigns";
import type { Campaign, CampaignStatus } from "@/types/database.types";

export type MarketingPageFilters = {
  search: string;
  status: string;
  from: string;
  to: string;
};

const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

/**
 * El rango se compara sobre la fecha de creación, que es la única que tienen
 * todas las campañas: `scheduled_at` y `sent_at` están vacías en un borrador.
 *
 * `to` incluye el día entero, si no un rango de un solo día no devolvería nada.
 */
function matchesDateRange(campaign: Campaign, from: string, to: string) {
  const createdAt = new Date(campaign.created_at).getTime();

  if (DATE_PATTERN.test(from)) {
    const start = new Date(`${from}T00:00:00`).getTime();

    if (createdAt < start) {
      return false;
    }
  }

  if (DATE_PATTERN.test(to)) {
    const end = new Date(`${to}T23:59:59.999`).getTime();

    if (createdAt > end) {
      return false;
    }
  }

  return true;
}

export function useMarketingPage(filters: MarketingPageFilters) {
  const campaigns = useCampaigns();
  const items = useMemo(() => campaigns.data ?? [], [campaigns.data]);

  const filteredCampaigns = useMemo(() => {
    const normalizedSearch = filters.search.trim().toLowerCase();

    return items.filter((campaign) => {
      if (filters.status && campaign.status !== filters.status) {
        return false;
      }

      if (!matchesDateRange(campaign, filters.from, filters.to)) {
        return false;
      }

      if (!normalizedSearch) {
        return true;
      }

      return campaign.title.toLowerCase().includes(normalizedSearch);
    });
  }, [filters.from, filters.search, filters.status, filters.to, items]);

  // El estado vacío solo aparece cuando no hay ninguna campaña. Si las hay pero
  // los filtros no dejan ninguna, la tabla muestra su propio mensaje: invitar a
  // crear la primera campaña cuando ya tienes veinte confundiría.
  const hasCampaigns = items.length > 0;

  return {
    campaigns,
    filteredCampaigns,
    hasCampaigns,
  };
}

export const CAMPAIGN_STATUS_VALUES: CampaignStatus[] = [
  "draft",
  "scheduled",
  "sent",
  "cancelled",
];
