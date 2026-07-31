import { notFound } from "next/navigation";

import InventoryDetailPageClient from "@/components/inventory/inventory-detail-page-client";
import {
  getInventoryItem,
  getInventoryMovements,
} from "@/dal/inventory.server.dal";
import { logger } from "@/lib/logger";

export default async function InventoryItemDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  let item: Awaited<ReturnType<typeof getInventoryItem>>;
  let movements: Awaited<ReturnType<typeof getInventoryMovements>>;

  try {
    [item, movements] = await Promise.all([
      getInventoryItem(id),
      getInventoryMovements(id),
    ]);
  } catch (cause) {
    logger.captureException(cause, {
      action: "loadInventoryDetail",
      itemId: id,
    });
    return <InventoryDetailPageClient />;
  }

  if (!item) {
    notFound();
  }

  return <InventoryDetailPageClient item={item} initialMovements={movements} />;
}
