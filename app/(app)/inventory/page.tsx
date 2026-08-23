import InventoryPageClient from "@/components/inventory/inventory-page-client";
import {
  getInventoryCategories,
  getInventoryItemsPage,
  getInventoryStockSummary,
} from "@/dal/inventory.server.dal";
import { INVENTORY_PAGE_SIZE } from "@/lib/inventory-pagination";
import { getServerActiveClinicId } from "@/lib/server/active-clinic";

/** `ok` es un alias histórico de `optimal`; ver `resolveStockLevel`. */
function resolveStockLevel(stockParam: string): string {
  if (stockParam === "critical" || stockParam === "low") {
    return stockParam;
  }

  if (stockParam === "ok" || stockParam === "optimal") {
    return "optimal";
  }

  return "";
}

export default async function InventoryPage({
  searchParams,
}: {
  searchParams: Promise<{
    category?: string;
    page?: string;
    q?: string;
    stock?: string;
  }>;
}) {
  const [params, clinicId] = await Promise.all([
    searchParams,
    getServerActiveClinicId(),
  ]);

  // Se siembra la consulta tal y como viene en la URL. Si no coincide con la
  // que calcula el cliente, `useServerSeed` la descarta y refetchea; sembrar
  // una página distinta de la que se va a mostrar sería peor que no sembrar.
  const query = {
    search: params.q?.trim() ?? "",
    category: params.category?.trim() ?? "",
    stockLevel: resolveStockLevel(params.stock?.trim() ?? ""),
    page: Math.max(0, Number.parseInt(params.page ?? "", 10) || 0),
    pageSize: INVENTORY_PAGE_SIZE,
  };

  const [page, categories, summary] = await Promise.all([
    getInventoryItemsPage({ ...query, clinicId }),
    getInventoryCategories(clinicId),
    getInventoryStockSummary(clinicId),
  ]);

  return (
    <InventoryPageClient
      initialPage={page}
      initialQuery={query}
      initialCategories={categories}
      initialSummary={summary}
    />
  );
}
