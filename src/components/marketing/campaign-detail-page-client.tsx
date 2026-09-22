"use client";

import { Copy, Pencil, Send } from "lucide-react";
import { notFound, useParams, useRouter } from "next/navigation";
import { useMemo, useState } from "react";

import CampaignDetailHeader from "@/components/marketing/components/detail/campaign-detail-header";
import CampaignDetailMessagePreview from "@/components/marketing/components/detail/campaign-detail-message-preview";
import CampaignReachSummary from "@/components/marketing/components/detail/campaign-reach-summary";
import CampaignRecipientsList from "@/components/marketing/components/detail/campaign-recipients-list";
import CampaignFormDialog from "@/components/marketing/components/form/campaign-form-dialog";
import { MARKETING_COPY } from "@/components/marketing/marketing-copy";
import AppConfirmDialog from "@/components/ui/app-confirm-dialog";
import PageSurface from "@/components/ui/page-surface";
import { Notice } from "@/components/ui/primitives/notice";
import { SkeletonList } from "@/components/ui/primitives/skeleton-list";
import { useCampaignCreateDialog } from "@/lib/hooks/use-campaign-create-dialog";
import { useCampaignDetail } from "@/lib/hooks/use-campaign-detail";
import { useTopbarActions } from "@/lib/hooks/use-topbar-actions";
import { useTopbarBreadcrumb } from "@/lib/hooks/use-topbar-breadcrumb";
import { useTreatments } from "@/lib/hooks/use-treatment";

const { detail, send, duplicate: duplicateCopy, editDialog } = MARKETING_COPY;

export default function CampaignDetailPageClient() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const {
    campaign,
    isLoading,
    error,
    recipients,
    pendingCount,
    isSending,
    sendError,
    send: sendNow,
    canStartSend,
    duplicate,
  } = useCampaignDetail(id);

  const canSend = campaign?.status === "draft";
  const isSendingStatus = campaign?.status === "sending";
  // Sólo se edita el borrador: una vez enviada, el mensaje ya salió y cambiarlo
  // dejaría el detalle contando algo distinto de lo que recibieron.
  const isDraft = canSend;
  const treatments = useTreatments();
  const treatmentOptions = useMemo(
    () =>
      (treatments.data ?? []).map((treatment) => ({
        id: treatment.id,
        name: treatment.name,
      })),
    [treatments.data],
  );
  const editDialogState = useCampaignCreateDialog(
    () => setEditOpen(false),
    isDraft ? campaign : null,
  );

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
          buttons: isSendingStatus
            ? []
            : canSend
              ? [
                  {
                    title: send.action,
                    icon: Send,
                    testId: "campaign-send-trigger",
                    onClick: () => {
                      if (canStartSend()) {
                        setConfirmOpen(true);
                      }
                    },
                  },
                ]
              : [
                  {
                    title: duplicateCopy.action,
                    icon: Copy,
                    onClick: () =>
                      duplicate((newId) => router.push(`/marketing/${newId}`)),
                  },
                ],
          menu: {
            // Editar acompaña a duplicar en el menú del borrador: la acción
            // principal ahí es enviar, y no conviene competir con ella.
            sections: canSend
              ? [
                  {
                    label: duplicateCopy.menuSections.campaign,
                    actions: [
                      {
                        label: editDialog.action,
                        icon: Pencil,
                        onClick: () => setEditOpen(true),
                      },
                      {
                        label: duplicateCopy.action,
                        icon: Copy,
                        onClick: () =>
                          duplicate((newId) =>
                            router.push(`/marketing/${newId}`),
                          ),
                      },
                    ],
                  },
                ]
              : [],
            ariaLabel: duplicateCopy.moreActions,
          },
        }
      : null,
  );

  if (isLoading) {
    return (
      <PageSurface busy>
        <SkeletonList />
      </PageSurface>
    );
  }

  if (error) {
    return (
      <PageSurface>
        <Notice tone="danger" message={detail.loadError} />
      </PageSurface>
    );
  }

  if (!campaign) {
    notFound();
  }

  return (
    <div
      data-testid="campaign-detail-page"
      className="surface-card-glass no-scrollbar flex min-h-0 flex-1 flex-col overflow-y-auto rounded-dialog lg:overflow-hidden"
    >
      <div className="shrink-0 border-b border-border-subtle px-4 py-6 lg:px-8">
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_auto] xl:items-end">
          <CampaignDetailHeader campaign={campaign} />
          <CampaignReachSummary recipients={recipients} />
        </div>
      </div>
      {sendError ? (
        <div className="shrink-0 px-4 pt-4 lg:px-8">
          <Notice tone="danger" message={sendError} />
        </div>
      ) : null}
      <div className="grid lg:min-h-0 lg:flex-1 lg:grid-cols-[minmax(0,2fr)_minmax(28rem,3fr)]">
        <section className="border-b border-border-subtle px-4 py-6 lg:min-h-0 lg:overflow-y-auto lg:border-b-0 lg:border-r lg:px-8">
          <h2 className="text-base font-medium text-ink">
            {detail.sections.message}
          </h2>
          <div className="mt-5">
            <CampaignDetailMessagePreview campaign={campaign} />
          </div>
        </section>
        <section className="flex min-h-0 flex-col px-4 py-6 lg:px-8">
          <div className="mb-4 flex shrink-0 items-baseline justify-between gap-4">
            <h2 className="text-base font-medium text-ink">
              {detail.sections.recipients}
            </h2>
            <p className="text-sm tabular-nums text-ink-muted">
              {detail.recipientCount(recipients.length)}
            </p>
          </div>
          <CampaignRecipientsList recipients={recipients} />
        </section>
      </div>
      {isDraft ? (
        <CampaignFormDialog
          open={editOpen}
          onOpenChange={setEditOpen}
          dialog={editDialogState}
          treatments={treatmentOptions}
          onCancel={() => setEditOpen(false)}
        />
      ) : null}
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
