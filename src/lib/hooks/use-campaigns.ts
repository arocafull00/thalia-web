import { useCallback, useEffect, useMemo } from "react";

import type {
  CampaignInsert,
  CampaignUpdate,
  CampaignPageResult,
} from "@/dal/campaigns.dal";
import { CAMPAIGNS_PAGE_SIZE } from "@/lib/campaign-pagination";
import { useServerSeed } from "@/lib/hooks/use-server-seed";
import {
  campaignsPageKey,
  useCampaignsStore,
  type CampaignsPageQuery,
} from "@/stores/campaigns-store";
import { isInitialLoading } from "@/stores/query-state";

type CampaignsPageFilters = {
  createdFrom: string | null;
  createdTo: string | null;
  page: number;
  search: string;
  status: string;
};

type CampaignsPageSeed = {
  initialPage?: CampaignPageResult;
  initialQuery?: CampaignsPageQuery;
};

/**
 * Listado de campañas paginado en servidor.
 *
 * Filtros, búsqueda y orden viajan al servidor: filtrar en cliente sobre una
 * página ya recortada daría recuentos falsos y rompería la paginación.
 */
export function useCampaignsPage(
  filters: CampaignsPageFilters,
  seed?: CampaignsPageSeed,
) {
  const query = useMemo<CampaignsPageQuery>(
    () => ({
      search: filters.search,
      status: filters.status,
      createdFrom: filters.createdFrom,
      createdTo: filters.createdTo,
      page: filters.page,
      pageSize: CAMPAIGNS_PAGE_SIZE,
    }),
    [
      filters.createdFrom,
      filters.createdTo,
      filters.page,
      filters.search,
      filters.status,
    ],
  );

  const key = campaignsPageKey(query);
  const entry = useCampaignsStore((state) => state.byPage[key]);
  const fetchCampaignsPage = useCampaignsStore(
    (state) => state.fetchCampaignsPage,
  );
  const seedCampaignsPage = useCampaignsStore(
    (state) => state.seedCampaignsPage,
  );

  // La siembra sólo vale para la consulta exacta que resolvió el servidor: si
  // los filtros de la URL no coinciden, se descarta y el cliente vuelve a pedir.
  const seededResult = useServerSeed(
    key,
    seed?.initialQuery ? campaignsPageKey(seed.initialQuery) : "",
    seed?.initialPage,
  );
  const hasClientData = entry?.data != null;

  useEffect(() => {
    if (seededResult === undefined || hasClientData) {
      return;
    }

    seedCampaignsPage(query, seededResult);
  }, [hasClientData, query, seedCampaignsPage, seededResult]);

  useEffect(() => {
    if (seededResult !== undefined) {
      return;
    }

    void fetchCampaignsPage(query);
  }, [fetchCampaignsPage, query, seededResult]);

  const resolved = entry?.data ?? seededResult ?? null;
  const campaigns = useMemo(() => resolved?.campaigns ?? [], [resolved]);

  return {
    campaigns,
    total: resolved?.total ?? 0,
    error: entry?.error ?? null,
    isLoading: resolved == null && isInitialLoading(entry),
  };
}

export function useCampaign(campaignId: string) {
  const entry = useCampaignsStore((state) => state.byId[campaignId]);
  const fetchCampaign = useCampaignsStore((state) => state.fetchCampaign);

  useEffect(() => {
    void fetchCampaign(campaignId);
  }, [campaignId, fetchCampaign]);

  return {
    data: entry?.data ?? null,
    isLoading: isInitialLoading(entry),
    error: entry?.error ?? null,
  };
}

export function useCreateCampaign() {
  const createCampaign = useCampaignsStore((state) => state.createCampaign);
  const isPending = useCampaignsStore((state) => state.creating);
  const error = useCampaignsStore((state) => state.createError);

  const mutate = useCallback(
    (
      input: CampaignInsert,
      options?: {
        onSuccess?: (campaignId: string) => void;
        onError?: (error: Error) => void;
      },
    ) => {
      createCampaign(input)
        .then((campaign) => options?.onSuccess?.(campaign.id))
        .catch((cause) =>
          options?.onError?.(
            cause instanceof Error ? cause : new Error(String(cause)),
          ),
        );
    },
    [createCampaign],
  );

  return { mutate, isPending, error };
}

export function useUpdateCampaign() {
  const updateCampaign = useCampaignsStore((state) => state.updateCampaign);
  const isPending = useCampaignsStore((state) => state.updating);
  const error = useCampaignsStore((state) => state.updateError);

  const mutate = useCallback(
    (
      campaignId: string,
      input: CampaignUpdate,
      options?: { onSuccess?: () => void; onError?: (error: Error) => void },
    ) => {
      updateCampaign(campaignId, input)
        .then(() => options?.onSuccess?.())
        .catch((cause) =>
          options?.onError?.(
            cause instanceof Error ? cause : new Error(String(cause)),
          ),
        );
    },
    [updateCampaign],
  );

  return { mutate, isPending, error };
}
