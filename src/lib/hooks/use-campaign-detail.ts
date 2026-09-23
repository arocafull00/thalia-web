import { useCallback, useState } from "react";
import { toast } from "sonner";

import { MARKETING_COPY } from "@/components/marketing/marketing-copy";
import { duplicateCampaign, sendCampaign } from "@/dal/campaigns.dal";
import { MAX_CAMPAIGN_RECIPIENTS } from "@/lib/campaign-limits";
import { useCampaign, useCampaignQuota } from "@/lib/hooks/use-campaigns";
import { useRevalidateOnEntry } from "@/lib/hooks/use-revalidate-on-entry";
import { logger } from "@/lib/logger";
import { notifySuccess } from "@/lib/sound";
import { useCampaignsStore } from "@/stores/campaigns-store";

export function useCampaignDetail(campaignId: string) {
  const campaign = useCampaign(campaignId);
  const { data: quota, refresh: refreshQuota } = useCampaignQuota();
  const fetchCampaign = useCampaignsStore((state) => state.fetchCampaign);
  const recipientsEntry = useCampaignsStore((state) => state.recipientsByCampaignId[campaignId]);
  const fetchCampaignRecipients = useCampaignsStore((state) => state.fetchCampaignRecipients);
  useRevalidateOnEntry(campaignId ? `campaign-recipients:${campaignId}` : null, () => fetchCampaignRecipients(campaignId));
  // Enviar y duplicar van directos al DAL, sin pasar por el store, así que las
  // páginas cacheadas del listado se quedarían obsoletas: la campaña enviada
  // seguiría figurando como borrador y la copia no aparecería.
  const refreshCampaignPages = useCampaignsStore(
    (state) => state.refreshCampaignPages,
  );
  const recipients = recipientsEntry?.data?.recipients ?? [];
  const pendingCount = recipientsEntry?.data?.pendingCount ?? null;
  const [isSending, setIsSending] = useState(false);
  const [sendError, setSendError] = useState<string | null>(null);

  const refresh = useCallback(() => {
    void fetchCampaignRecipients(campaignId);
  }, [campaignId, fetchCampaignRecipients]);

  const canStartSend = useCallback(() => {
    if (pendingCount == null) {
      toast.error(MARKETING_COPY.limits.recipientCountUnavailable);
      return false;
    }

    if (pendingCount > MAX_CAMPAIGN_RECIPIENTS) {
      toast.error(MARKETING_COPY.limits.recipientLimitExceeded);
      return false;
    }

    if (quota?.reached) {
      toast.error(MARKETING_COPY.limits.sentLimitReached);
      return false;
    }

    return true;
  }, [pendingCount, quota?.reached]);

  const send = useCallback(() => {
    if (!canStartSend()) {
      return;
    }

    setIsSending(true);
    setSendError(null);

    sendCampaign(campaignId)
      .then((result) => {
        notifySuccess(MARKETING_COPY.send.success(result.sent));
        // Recargar también la campaña: el envío cambia su status a 'sent', y
        // sin esto seguiría mostrándose como borrador con el botón de enviar
        // disponible para un segundo intento.
        void fetchCampaign(campaignId);
        void refreshCampaignPages();
        void refreshQuota().catch(() => undefined);
        refresh();
      })
      .catch((cause) => {
        const message = cause instanceof Error ? cause.message : String(cause);
        logger.captureException(cause, {
          hook: "use-campaign-detail",
          action: "sendCampaign",
          campaignId,
        });
        setSendError(message || MARKETING_COPY.send.error);
        toast.error(message || MARKETING_COPY.send.error);
      })
      .finally(() => setIsSending(false));
  }, [
    campaignId,
    canStartSend,
    fetchCampaign,
    refresh,
    refreshQuota,
    refreshCampaignPages,
  ]);

  const [isDuplicating, setIsDuplicating] = useState(false);

  const duplicate = useCallback(
    (onDuplicated: (newCampaignId: string) => void) => {
      if (quota?.reached) {
        toast.error(MARKETING_COPY.limits.sentLimitReached);
        return;
      }

      setIsDuplicating(true);
      setSendError(null);

      duplicateCampaign(campaignId, MARKETING_COPY.duplicate.copyPrefix)
        .then((created) => {
          notifySuccess(MARKETING_COPY.duplicate.success);
          void refreshCampaignPages();
          void refreshQuota().catch(() => undefined);
          onDuplicated(created.id);
        })
        .catch((cause) => {
          logger.captureException(cause, {
            hook: "use-campaign-detail",
            action: "duplicateCampaign",
            campaignId,
          });
          const message =
            cause instanceof Error
              ? cause.message
              : MARKETING_COPY.duplicate.error;
          setSendError(message);
          toast.error(message);
        })
        .finally(() => setIsDuplicating(false));
    },
    [campaignId, quota?.reached, refreshCampaignPages, refreshQuota],
  );

  return {
    campaign: campaign.data,
    isLoading: campaign.isLoading,
    error: campaign.error,
    recipients,
    pendingCount,
    isSending,
    sendError,
    send,
    canStartSend,
    duplicate,
    isDuplicating,
    refresh,
  };
}
