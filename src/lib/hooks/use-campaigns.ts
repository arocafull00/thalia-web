import { useCallback, useEffect } from "react";

import type { CampaignInsert, CampaignUpdate } from "@/dal/campaigns.dal";
import { useClinicId } from "@/lib/hooks/use-active-clinic";
import { useCampaignsStore } from "@/stores/campaigns-store";
import { isInitialLoading } from "@/stores/query-state";

export function useCampaigns() {
  const entry = useCampaignsStore((state) => state.list);
  const fetchCampaigns = useCampaignsStore((state) => state.fetchCampaigns);
  const clinicId = useClinicId();

  useEffect(() => {
    void fetchCampaigns();
  }, [clinicId, fetchCampaigns]);

  return {
    data: entry.data,
    isLoading: isInitialLoading(entry),
    error: entry.error,
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
