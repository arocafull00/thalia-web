"use client";

import { MARKETING_COPY } from "@/components/marketing/marketing-copy";
import { useCampaignImageUrl } from "@/lib/hooks/use-campaign-image-url";

type CampaignDetailImageProps = {
  storageKey: string;
};

export default function CampaignDetailImage({
  storageKey,
}: CampaignDetailImageProps) {
  const { url } = useCampaignImageUrl(storageKey);

  if (!url) {
    return null;
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={url}
      alt={MARKETING_COPY.messagePreview.imageAlt}
      data-testid="campaign-detail-image"
      className="mb-3 w-full max-w-sm rounded-xl object-cover"
    />
  );
}
