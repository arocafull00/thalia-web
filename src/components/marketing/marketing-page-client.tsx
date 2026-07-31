"use client";

import { useRouter } from "next/navigation";
import { useCallback, useMemo, useState } from "react";

import CampaignCreateForm from "@/components/marketing/components/form/campaign-create-form";
import CampaignImageDialog from "@/components/marketing/components/list/campaign-image-dialog";
import CampaignsEmptyState from "@/components/marketing/components/list/campaigns-empty-state";
import CampaignsTable from "@/components/marketing/components/list/campaigns-table";
import { MARKETING_COPY } from "@/components/marketing/marketing-copy";
import AppDialog from "@/components/ui/app-dialog";
import AppDialogDescription from "@/components/ui/app-dialog-description";
import AppDialogFooter from "@/components/ui/app-dialog-footer";
import AppDialogHeader from "@/components/ui/app-dialog-header";
import AppDialogTitle from "@/components/ui/app-dialog-title";
import AppSheetContent from "@/components/ui/app-sheet-content";
import { Button } from "@/components/ui/button";
import { ActionButton } from "@/components/ui/primitives/action-button";
import { MobileFab } from "@/components/ui/primitives/mobile-fab";
import { Notice } from "@/components/ui/primitives/notice";
import { SkeletonList } from "@/components/ui/primitives/skeleton-list";
import { useCampaignCreateDialog } from "@/lib/hooks/use-campaign-create-dialog";
import { useCampaigns } from "@/lib/hooks/use-campaigns";
import { useTopbarAction } from "@/lib/hooks/use-topbar-action";
import { useTreatments } from "@/lib/hooks/use-treatment";

export default function MarketingPageClient() {
  const router = useRouter();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [imageKey, setImageKey] = useState<string | null>(null);
  const campaigns = useCampaigns();
  const treatments = useTreatments();
  const dialog = useCampaignCreateDialog(() => setDialogOpen(false));

  const treatmentOptions = useMemo(
    () =>
      (treatments.data ?? []).map((treatment) => ({
        id: treatment.id,
        name: treatment.name,
      })),
    [treatments.data],
  );

  const items = campaigns.data ?? [];
  const showEmptyState = !campaigns.isLoading && items.length === 0;

  const handleCancelCreate = () => {
    dialog.reset();
    setDialogOpen(false);
  };

  // Estable para que las columnas no se reconstruyan en cada render.
  const handleOpenImage = useCallback((key: string) => setImageKey(key), []);

  useTopbarAction({
    title: MARKETING_COPY.actions.create,
    testId: "campaign-create-trigger",
    onClick: () => setDialogOpen(true),
  });

  return (
    <div data-testid="marketing-page" className="flex min-h-0 flex-1 flex-col">
      <div className="min-h-0 flex-1 overflow-y-auto">
        <div className="space-y-6 px-4 py-4 lg:px-8 lg:py-6">
          {campaigns.isLoading ? <SkeletonList /> : null}
          {campaigns.error ? (
            <Notice tone="danger" message={MARKETING_COPY.page.loadError} />
          ) : null}
          {showEmptyState ? <CampaignsEmptyState /> : null}
          {!campaigns.isLoading && items.length > 0 ? (
            <CampaignsTable
              campaigns={items}
              onRowClick={(campaignId) =>
                router.push(`/marketing/${campaignId}`)
              }
              onOpenImage={handleOpenImage}
            />
          ) : null}
        </div>
      </div>
      <AppDialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <AppSheetContent>
          <AppDialogHeader>
            <AppDialogTitle>{MARKETING_COPY.createDialog.title}</AppDialogTitle>
            <AppDialogDescription>
              {MARKETING_COPY.createDialog.description}
            </AppDialogDescription>
          </AppDialogHeader>
          <div className="min-h-0 flex-1 overflow-y-auto px-1">
            <CampaignCreateForm
              register={dialog.register}
              errors={dialog.errors}
              segmentInputs={dialog.segmentInputs}
              treatments={treatmentOptions}
              onSegmentChange={dialog.setSegmentInput}
              onImageChange={dialog.setImage}
              previewContent={dialog.watch("content") ?? ""}
              previewFooterText={dialog.watch("footer_text") ?? ""}
              previewFooterWebsite={dialog.watch("footer_website") ?? ""}
              previewFooterPhone={dialog.watch("footer_phone") ?? ""}
              recipientCount={dialog.preview.count}
              recipientsLoading={dialog.preview.isLoading}
              recipientsError={dialog.preview.error != null}
            />
          </div>
          <AppDialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={handleCancelCreate}
              className="rounded-button px-3 py-1.5 text-sm"
            >
              {MARKETING_COPY.createDialog.actions.cancel}
            </Button>
            <ActionButton
              title={
                dialog.isPending
                  ? MARKETING_COPY.createDialog.actions.saving
                  : MARKETING_COPY.createDialog.actions.save
              }
              disabled={dialog.isPending}
              testId="campaign-create-submit"
              onClick={dialog.handleSubmit}
            />
          </AppDialogFooter>
        </AppSheetContent>
      </AppDialog>
      <CampaignImageDialog
        storageKey={imageKey}
        open={imageKey !== null}
        onOpenChange={(next) => {
          if (!next) {
            setImageKey(null);
          }
        }}
      />
      <MobileFab
        label={MARKETING_COPY.actions.create}
        onClick={() => setDialogOpen(true)}
      />
    </div>
  );
}
