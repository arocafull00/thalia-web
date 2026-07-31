"use client";

import { MARKETING_COPY } from "@/components/marketing/marketing-copy";
import AppDialog from "@/components/ui/app-dialog";
import AppDialogContent from "@/components/ui/app-dialog-content";
import AppDialogHeader from "@/components/ui/app-dialog-header";
import AppDialogTitle from "@/components/ui/app-dialog-title";
import { useCampaignImageUrl } from "@/lib/hooks/use-campaign-image-url";

const { imageDialog, messagePreview } = MARKETING_COPY;

type CampaignImageDialogProps = {
  storageKey: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export default function CampaignImageDialog({
  storageKey,
  open,
  onOpenChange,
}: CampaignImageDialogProps) {
  const { url, isLoading, hasError } = useCampaignImageUrl(
    open ? storageKey : null,
  );

  return (
    <AppDialog open={open} onOpenChange={onOpenChange}>
      <AppDialogContent>
        <AppDialogHeader>
          <AppDialogTitle>{imageDialog.title}</AppDialogTitle>
        </AppDialogHeader>
        <div
          data-testid="campaign-image-dialog"
          className="flex min-h-40 items-center justify-center py-2"
        >
          {isLoading ? (
            <p className="text-sm text-ink-muted">{imageDialog.loading}</p>
          ) : null}
          {hasError ? (
            <p className="text-sm text-danger">{imageDialog.error}</p>
          ) : null}
          {url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={url}
              alt={messagePreview.imageAlt}
              className="max-h-[60vh] w-full rounded-xl object-contain"
            />
          ) : null}
        </div>
      </AppDialogContent>
    </AppDialog>
  );
}
