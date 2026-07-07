import InventoryDetailPageClient from "@/components/inventory/inventory-detail-page-client";

export default async function InventoryItemDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <InventoryDetailPageClient itemId={id} />;
}
