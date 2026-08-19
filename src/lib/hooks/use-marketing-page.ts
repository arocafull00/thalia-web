import { useMemo } from "react";

import type { CampaignPageResult } from "@/dal/campaigns.dal";
import { campaignDateRangeToIso } from "@/lib/campaign-pagination";
import { useCampaignsPage } from "@/lib/hooks/use-campaigns";
import type { CampaignsPageQuery } from "@/stores/campaigns-store";
import type { CampaignStatus } from "@/types/database.types";

export type MarketingPageFilters = {
  search: string;
  status: string;
  from: string;
  to: string;
  page: number;
};

type MarketingPageSeed = {
  initialPage?: CampaignPageResult;
  initialQuery?: CampaignsPageQuery;
};

export function useMarketingPage(
  filters: MarketingPageFilters,
  seed?: MarketingPageSeed,
) {
  const { createdFrom, createdTo } = useMemo(
    () => campaignDateRangeToIso(filters.from, filters.to),
    [filters.from, filters.to],
  );

  const page = useCampaignsPage(
    {
      createdFrom,
      createdTo,
      page: filters.page,
      search: filters.search,
      status: filters.status,
    },
    seed,
  );

  // Con paginación en servidor no se puede saber si la clínica tiene campañas
  // mirando las filas cargadas: son sólo las de la página. Se deduce del total,
  // y con filtros activos se asume que sí las hay — si no, filtrar hasta cero
  // resultados escondería la barra de filtros y no habría forma de deshacerlo.
  const hasActiveFilters = Boolean(
    filters.search.trim() || filters.status || filters.from || filters.to,
  );
  const hasCampaigns = hasActiveFilters || page.total > 0;

  return {
    campaigns: page,
    hasCampaigns,
  };
}

export const CAMPAIGN_STATUS_VALUES: CampaignStatus[] = [
  "draft",
  "scheduled",
  "sent",
  "cancelled",
];
