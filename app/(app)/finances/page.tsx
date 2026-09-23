import FinancesPageClient from "@/components/finances/finances-page-client";
import { requireBusinessOwner } from "@/lib/server/business-access";

export default async function FinancesPage() {
  await requireBusinessOwner();
  return <FinancesPageClient />;
}
