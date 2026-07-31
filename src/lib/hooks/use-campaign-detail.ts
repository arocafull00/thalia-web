import { useCallback, useEffect, useState } from "react";

import { MARKETING_COPY } from "@/components/marketing/marketing-copy";
import {
  countCampaignPatients,
  getCampaignRecipients,
} from "@/dal/campaign-recipients.dal";
import { sendCampaign } from "@/dal/campaigns.dal";
import { useCampaign } from "@/lib/hooks/use-campaigns";
import { logger } from "@/lib/logger";
import { notifySuccess } from "@/lib/sound";
import { useCampaignsStore } from "@/stores/campaigns-store";
import type { CampaignRecipientWithPatient } from "@/types/database.types";

export function useCampaignDetail(campaignId: string) {
  const campaign = useCampaign(campaignId);
  const fetchCampaign = useCampaignsStore((state) => state.fetchCampaign);
  const [recipients, setRecipients] = useState<CampaignRecipientWithPatient[]>(
    [],
  );
  const [pendingCount, setPendingCount] = useState<number | null>(null);
  const [isSending, setIsSending] = useState(false);
  const [sendError, setSendError] = useState<string | null>(null);

  const refresh = useCallback(() => {
    let cancelled = false;

    void Promise.all([
      getCampaignRecipients(campaignId),
      countCampaignPatients(campaignId),
    ])
      .then(([rows, count]) => {
        if (cancelled) {
          return;
        }

        setRecipients(rows);
        setPendingCount(count);
      })
      .catch((cause) => {
        logger.captureException(cause, {
          hook: "use-campaign-detail",
          campaignId,
        });
      });

    return () => {
      cancelled = true;
    };
  }, [campaignId]);

  useEffect(() => refresh(), [refresh]);

  const send = useCallback(() => {
    setIsSending(true);
    setSendError(null);

    sendCampaign(campaignId)
      .then((result) => {
        notifySuccess(MARKETING_COPY.send.success(result.sent));
        // Recargar también la campaña: el envío cambia su status a 'sent', y
        // sin esto seguiría mostrándose como borrador con el botón de enviar
        // disponible para un segundo intento.
        void fetchCampaign(campaignId);
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
      })
      .finally(() => setIsSending(false));
  }, [campaignId, fetchCampaign, refresh]);

  return {
    campaign: campaign.data,
    isLoading: campaign.isLoading,
    error: campaign.error,
    recipients,
    pendingCount,
    isSending,
    sendError,
    send,
    refresh,
  };
}
