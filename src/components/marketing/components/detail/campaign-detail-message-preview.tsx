"use client";

import CampaignMessagePreview from "@/components/marketing/components/form/campaign-message-preview";
import { useCampaignImageUrl } from "@/lib/hooks/use-campaign-image-url";
import type { Campaign } from "@/types/database.types";

type CampaignDetailMessagePreviewProps = {
  campaign: Campaign;
};

export default function CampaignDetailMessagePreview({
  campaign,
}: CampaignDetailMessagePreviewProps) {
  const { url } = useCampaignImageUrl(campaign.image_url);

  return (
    <CampaignMessagePreview
      content={campaign.content}
      footerText={campaign.footer_text ?? ""}
      footerWebsite={campaign.footer_website ?? ""}
      footerPhone={campaign.footer_phone ?? ""}
      imageUrl={url}
      variant="detail"
    />
  );
}
