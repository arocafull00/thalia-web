import MarketingPageClient from "@/components/marketing/marketing-page-client";
import { requireBusinessOwner } from "@/lib/server/business-access";

export default async function MarketingPage() {
  await requireBusinessOwner();
  return <MarketingPageClient />;
}
