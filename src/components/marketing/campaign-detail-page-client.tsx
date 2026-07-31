"use client";

import { Send } from "lucide-react";
import { notFound, useParams } from "next/navigation";
import { useState } from "react";

import CampaignDetailHeader from "@/components/marketing/components/detail/campaign-detail-header";
import CampaignDetailImage from "@/components/marketing/components/detail/campaign-detail-image";
import CampaignRecipientsList from "@/components/marketing/components/detail/campaign-recipients-list";
import CampaignMessagePreview from "@/components/marketing/components/form/campaign-message-preview";
import { MARKETING_COPY } from "@/components/marketing/marketing-copy";
import AppConfirmDialog from "@/components/ui/app-confirm-dialog";
import { Notice } from "@/components/ui/primitives/notice";
import { SkeletonList } from "@/components/ui/primitives/skeleton-list";
import { useCampaignDetail } from "@/lib/hooks/use-campaign-detail";
import { useTopbarAction } from "@/lib/hooks/use-topbar-action";
import { useTopbarBreadcrumb } from "@/lib/hooks/use-topbar-breadcrumb";

const { detail, send } = MARKETING_COPY;

export default function CampaignDetailPageClient() {
  const { id } = useParams<{ id: string }>();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const {
    campaign,
    isLoading,
    error,
    recipients,
    pendingCount,
    isSending,
    sendError,
    send: sendNow,
  } = useCampaignDetail(id);

  const canSend = campaign?.status === "draft";

  useTopbarBreadcrumb(
    campaign
      ? {
          rootLabel: detail.breadcrumbRoot,
          rootHref: "/marketing",
          currentLabel: campaign.title,
        }
      : null,
  );

  // Solo se ofrece enviar mientras es borrador: una campaña ya enviada o
  // cancelada no debe tener el botón a mano.
  useTopbarAction(
    canSend
      ? {
          title: send.action,
          icon: Send,
          testId: "campaign-send-trigger",
          onClick: () => setConfirmOpen(true),
        }
      : null,
  );

  if (isLoading) {
    return (
      <div className="p-8" aria-busy="true">
        <SkeletonList />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <Notice tone="danger" message={detail.loadError} />
      </div>
    );
  }

  if (!campaign) {
    notFound();
  }

  return (
    <div
      data-testid="campaign-detail-page"
      className="flex min-h-0 flex-1 flex-col overflow-y-auto"
    >
      <CampaignDetailHeader campaign={campaign} />
      <div className="flex flex-col gap-8 px-4 pb-8 lg:px-8">
        {sendError ? <Notice tone="danger" message={sendError} /> : null}
        {campaign.image_url ? (
          <CampaignDetailImage storageKey={campaign.image_url} />
        ) : null}
        <CampaignMessagePreview
          content={campaign.content}
          footerText={campaign.footer_text ?? ""}
          footerWebsite={campaign.footer_website ?? ""}
          footerPhone={campaign.footer_phone ?? ""}
        />
        <section className="space-y-3">
          <h2 className="text-sm font-medium text-ink">
            {detail.sections.recipients}
          </h2>
          <CampaignRecipientsList recipients={recipients} />
        </section>
      </div>
      <AppConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title={send.confirmTitle}
        description={
          pendingCount === 0
            ? send.confirmNoRecipients
            : send.confirmDescription(pendingCount ?? 0)
        }
        confirmLabel={send.confirm}
        cancelLabel={send.cancel}
        pendingLabel={send.sending}
        isPending={isSending}
        onConfirm={() => {
          setConfirmOpen(false);
          sendNow();
        }}
      />
    </div>
  );
}
