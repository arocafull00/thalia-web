"use client";

import { Copy, Pencil, Send } from "lucide-react";
import { notFound, useParams, useRouter } from "next/navigation";
import { useMemo, useState } from "react";

import CampaignDetailHeader from "@/components/marketing/components/detail/campaign-detail-header";
import CampaignDetailImage from "@/components/marketing/components/detail/campaign-detail-image";
import CampaignReachSummary from "@/components/marketing/components/detail/campaign-reach-summary";
import CampaignRecipientsList from "@/components/marketing/components/detail/campaign-recipients-list";
import CampaignFormDialog from "@/components/marketing/components/form/campaign-form-dialog";
import CampaignMessagePreview from "@/components/marketing/components/form/campaign-message-preview";
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
    duplicate,
  } = useCampaignDetail(id);

  const canSend = campaign?.status === "draft";
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
          buttons: canSend
            ? [
                {
                  title: send.action,
                  icon: Send,
                  testId: "campaign-send-trigger",
                  onClick: () => setConfirmOpen(true),
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
      className="surface-card no-scrollbar flex min-h-0 flex-1 flex-col overflow-y-auto rounded-dialog"
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
          {/* Sin imagen: aquí ya tiene columna propia y duplicarla dentro de
              la burbuja sólo repetiría lo mismo al lado. */}
          <CampaignMessagePreview
            content={campaign.content}
            footerText={campaign.footer_text ?? ""}
            footerWebsite={campaign.footer_website ?? ""}
            footerPhone={campaign.footer_phone ?? ""}
            imageUrl={null}
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
