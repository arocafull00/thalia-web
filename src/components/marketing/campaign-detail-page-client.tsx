"use client";

import { Copy, Send } from "lucide-react";
import { notFound, useParams, useRouter } from "next/navigation";
import { useState } from "react";

import CampaignDetailHeader from "@/components/marketing/components/detail/campaign-detail-header";
import CampaignDetailImage from "@/components/marketing/components/detail/campaign-detail-image";
import CampaignReachSummary from "@/components/marketing/components/detail/campaign-reach-summary";
import CampaignRecipientsList from "@/components/marketing/components/detail/campaign-recipients-list";
import CampaignMessagePreview from "@/components/marketing/components/form/campaign-message-preview";
import { MARKETING_COPY } from "@/components/marketing/marketing-copy";
import AppConfirmDialog from "@/components/ui/app-confirm-dialog";
import { Notice } from "@/components/ui/primitives/notice";
import { SkeletonList } from "@/components/ui/primitives/skeleton-list";
import { useCampaignDetail } from "@/lib/hooks/use-campaign-detail";
import { useTopbarActions } from "@/lib/hooks/use-topbar-actions";
import { useTopbarBreadcrumb } from "@/lib/hooks/use-topbar-breadcrumb";

const { detail, send, duplicate: duplicateCopy } = MARKETING_COPY;

export default function CampaignDetailPageClient() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
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
    duplicate,
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

  // Enviar solo mientras es borrador; duplicar siempre, porque el caso típico
  // es partir de una campaña ya enviada que funcionó.
  useTopbarActions(
    campaign
      ? {
          buttons: canSend
            ? [
                {
                  title: send.action,
                  icon: Send,
                  testId: "campaign-send-trigger",
                  onClick: () => setConfirmOpen(true),
                },
              ]
            : [],
          menu: {
            ariaLabel: duplicateCopy.moreActions,
            actions: [
              {
                label: duplicateCopy.action,
                icon: Copy,
                onClick: () =>
                  duplicate((newId) => router.push(`/marketing/${newId}`)),
                buttonVariant: "ghost",
              },
            ],
          },
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
        {/* Imagen y mensaje en columnas a partir de lg: apilados obligaban a
            bajar hasta los destinatarios en cualquier pantalla de escritorio. */}
        <div className="grid gap-6 lg:grid-cols-3 lg:items-start">
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
            <CampaignReachSummary recipients={recipients} />
            <CampaignRecipientsList recipients={recipients} />
          </section>
        </div>
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
