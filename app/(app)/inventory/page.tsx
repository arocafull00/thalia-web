import InventoryPageClient from "@/components/inventory/inventory-page-client";
import { getInventoryItems } from "@/dal/inventory.server.dal";
import { getServerActiveClinicId } from "@/lib/server/active-clinic";

export default async function InventoryPage() {
  const clinicId = await getServerActiveClinicId();
  const items = await getInventoryItems(clinicId);

  return <InventoryPageClient initialItems={items} />;
}
