import InventoryPageClient from "@/components/inventory/inventory-page-client";
import { requireBusinessOwner } from "@/lib/server/business-access";

export default async function InventoryPage() {
  await requireBusinessOwner();
  return <InventoryPageClient />;
}
