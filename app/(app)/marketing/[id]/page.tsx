import CampaignDetailPageClient from "@/components/marketing/campaign-detail-page-client";
import { requireBusinessOwner } from "@/lib/server/business-access";

export default async function CampaignDetailPage() {
  await requireBusinessOwner();
  return <CampaignDetailPageClient />;
}
