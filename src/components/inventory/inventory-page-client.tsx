"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import InventoryItemCreateForm from "@/components/inventory/components/inventory-item-create-form";
import InventoryTable from "@/components/inventory/components/inventory-table";
import AppDialog from "@/components/ui/app-dialog";
import AppDialogDescription from "@/components/ui/app-dialog-description";
import AppDialogFooter from "@/components/ui/app-dialog-footer";
import AppDialogHeader from "@/components/ui/app-dialog-header";
import AppDialogTitle from "@/components/ui/app-dialog-title";
import AppSheetContent from "@/components/ui/app-sheet-content";
import { ActionButton } from "@/components/ui/primitives/action-button";
import { Notice } from "@/components/ui/primitives/notice";
import { PageHeader } from "@/components/ui/primitives/page-header";
import { SkeletonList } from "@/components/ui/primitives/skeleton-list";
import { INVENTORY_ITEM_CREATE_COPY } from "@/copy/inventory-item-create-copy";
import { useInventoryItemCreateDialog } from "@/lib/hooks/use-inventory-item-create-dialog";
import { useInventoryPage } from "@/lib/hooks/use-inventory-page";
import { useTopbarSearchStore } from "@/stores/topbar-search-store";

export default function InventoryPageClient() {
  const router = useRouter();
  const [dialogOpen, setDialogOpen] = useState(false);
  const topbarQuery = useTopbarSearchStore((state) => state.query);
  const dialog = useInventoryItemCreateDialog(() => setDialogOpen(false));
  const {
    categories,
    category,
    filteredItems,
    handleCategoryChange,
    inventory,
    summary,
  } = useInventoryPage(topbarQuery);

  const handleDialogOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) {
      dialog.reset();
    }

    setDialogOpen(nextOpen);
  };

  return (
    <div className="space-y-6 p-8">
      <div className="flex items-start justify-between gap-4">
        <PageHeader
          subtitle="Gestion centralizada de insumos esteticos y quirurgicos."
          title="Inventario de Materiales"
        />
        <ActionButton
          title="Anadir material"
          onClick={() => setDialogOpen(true)}
        />
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {[
          { label: "Critico", value: summary.critical, tone: "text-danger" },
          { label: "Bajo", value: summary.low, tone: "text-warning" },
          { label: "Optimo", value: summary.optimal, tone: "text-success" },
        ].map((entry) => (
          <div
            key={entry.label}
            className="rounded-2xl border border-border bg-surface p-5"
          >
            <p className="text-xs uppercase tracking-wide text-ink-muted">
              {entry.label}
            </p>
            <p className={`mt-2 text-3xl font-medium ${entry.tone}`}>
              {entry.value}
            </p>
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
                ? "bg-primary text-on-primary"
                : "bg-surface text-ink-secondary ring-1 ring-border"
            }`}
          >
            {entry}
          </button>
        ))}
      </div>
      {inventory.isLoading ? <SkeletonList /> : null}
      {inventory.error ? (
        <Notice tone="danger" message="No se pudo cargar el inventario." />
      ) : null}
      {!inventory.isLoading ? (
        <InventoryTable
          items={filteredItems}
          onRowClick={(id) => router.push(`/inventory/${id}`)}
        />
      ) : null}
      <AppDialog open={dialogOpen} onOpenChange={handleDialogOpenChange}>
        <AppSheetContent>
          <AppDialogHeader>
            <AppDialogTitle>{INVENTORY_ITEM_CREATE_COPY.title}</AppDialogTitle>
            <AppDialogDescription>
              {INVENTORY_ITEM_CREATE_COPY.description}
            </AppDialogDescription>
          </AppDialogHeader>
          <div className="min-h-0 flex-1 overflow-y-auto px-1">
            <InventoryItemCreateForm
              register={dialog.register}
              errors={dialog.errors}
            />
          </div>
          <AppDialogFooter>
            <button
              type="button"
              onClick={() => handleDialogOpenChange(false)}
              className="rounded-full border border-border px-4 py-2 text-xs font-medium uppercase tracking-wide text-ink-secondary hover:bg-canvas"
            >
              {INVENTORY_ITEM_CREATE_COPY.actions.cancel}
            </button>
            <ActionButton
              title={
                dialog.isPending
                  ? INVENTORY_ITEM_CREATE_COPY.actions.saving
                  : INVENTORY_ITEM_CREATE_COPY.actions.save
              }
              disabled={dialog.isPending}
              onClick={dialog.handleSubmit}
            />
          </AppDialogFooter>
        </AppSheetContent>
      </AppDialog>
    </div>
  );
}
