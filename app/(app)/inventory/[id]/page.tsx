import InventoryDetailPageClient from "@/components/inventory/inventory-detail-page-client";
import { requireBusinessOwner } from "@/lib/server/business-access";

export default async function InventoryItemDetailPage() {
  await requireBusinessOwner();
  return <InventoryDetailPageClient />;
}
