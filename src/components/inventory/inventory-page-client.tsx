"use client";

import { useRouter } from "next/navigation";

import { ActionButton, Notice, PageHeader, SkeletonList } from "@/components/ui/primitives";
import { useInventoryPage } from "@/lib/hooks/use-inventory-page";
import { getInventoryStockLevel, inventoryStockLevelLabel } from "@/lib/inventory-stock";
import { useTopbarSearchStore } from "@/stores/topbar-search-store";

export default function InventoryPageClient() {
  const router = useRouter();
  const topbarQuery = useTopbarSearchStore((state) => state.query);
  const {
    categories,
    category,
    currentPage,
    filteredItems,
    handleCategoryChange,
    inventory,
    pageEnd,
    pageItems,
    pageStart,
    setPage,
    summary,
    totalPages,
  } = useInventoryPage(topbarQuery);

  return (
    <div className="space-y-6 p-8">
      <div className="flex items-start justify-between gap-4">
        <PageHeader
          subtitle="Gestion centralizada de insumos esteticos y quirurgicos."
          title="Inventario de Materiales"
        />
        <ActionButton title="Anadir material" onClick={() => router.push("/inventory/new")} />
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {[
          { label: "Critico", value: summary.critical, tone: "text-red-600" },
          { label: "Bajo", value: summary.low, tone: "text-amber-600" },
          { label: "Optimo", value: summary.optimal, tone: "text-emerald-600" },
        ].map((entry) => (
          <div key={entry.label} className="rounded-2xl border border-zinc-200 bg-white p-5">
            <p className="text-xs uppercase tracking-wide text-zinc-400">{entry.label}</p>
            <p className={`mt-2 text-3xl font-medium ${entry.tone}`}>{entry.value}</p>
          </div>
        ))}
      </div>
      <div className="flex flex-wrap gap-2">
        {categories.map((entry) => (
          <button
            key={entry}
            type="button"
            onClick={() => handleCategoryChange(entry === "Todos" ? "" : entry)}
            className={`rounded-full px-4 py-2 text-sm ${
              (entry === "Todos" && !category) || category === entry
                ? "bg-zinc-900 text-white"
                : "bg-white text-zinc-600 ring-1 ring-zinc-200"
            }`}
          >
            {entry}
          </button>
        ))}
      </div>
      {inventory.isLoading ? <SkeletonList /> : null}
      {inventory.error ? <Notice tone="danger" message="No se pudo cargar el inventario." /> : null}
      {!inventory.isLoading ? (
        <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white">
          <div className="grid grid-cols-[1.6fr_0.9fr_1fr_0.8fr_0.9fr] gap-4 border-b border-zinc-200 px-4 py-2 text-xs uppercase tracking-wide text-zinc-400">
            <span>Material</span>
            <span>Categoria</span>
            <span>Stock</span>
            <span>Minimo</span>
            <span>Estado</span>
          </div>
          {pageItems.map((item) => {
            const stock = Number(item.stock ?? 0);
            const minStock = Number(item.min_stock ?? 0);
            const level = getInventoryStockLevel(stock, minStock);

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => router.push(`/inventory/${item.id}`)}
                className="grid w-full grid-cols-[1.6fr_0.9fr_1fr_0.8fr_0.9fr] gap-4 border-b border-zinc-100 px-4 py-4 text-left transition hover:bg-zinc-50"
              >
                <span>
                  <span className="block truncate font-medium text-zinc-900">{item.name}</span>
                  <span className="text-xs text-zinc-400">REF: {item.id.slice(0, 8).toUpperCase()}</span>
                </span>
                <span className="truncate text-sm text-zinc-500">{item.category ?? "Sin categoria"}</span>
                <span className="font-medium tabular-nums text-zinc-900">
                  {stock} {item.unit ?? "un."}
                </span>
                <span className="text-sm tabular-nums text-zinc-500">{minStock}</span>
                <span
                  className={`text-xs uppercase tracking-wide ${
                    level === "critical"
                      ? "text-red-500"
                      : level === "low"
                        ? "text-amber-600"
                        : "text-emerald-600"
                  }`}
                >
                  {inventoryStockLevelLabel(level)}
                </span>
              </button>
            );
          })}
          {filteredItems.length === 0 ? (
            <p className="p-6 text-center text-zinc-500">No hay materiales con ese criterio.</p>
          ) : null}
          <div className="flex items-center justify-between px-4 py-3 text-sm text-zinc-500">
            <span>
              {filteredItems.length === 0 ? 0 : pageStart + 1}-{pageEnd} de {filteredItems.length}
            </span>
            <div className="flex gap-2">
              <button
                type="button"
                disabled={currentPage <= 1}
                onClick={() => setPage((current) => Math.max(current - 1, 1))}
                className="rounded-lg border border-zinc-200 px-3 py-1 disabled:opacity-40"
              >
                Anterior
              </button>
              <button
                type="button"
                disabled={currentPage >= totalPages}
                onClick={() => setPage((current) => Math.min(current + 1, totalPages))}
                className="rounded-lg border border-zinc-200 px-3 py-1 disabled:opacity-40"
              >
                Siguiente
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
