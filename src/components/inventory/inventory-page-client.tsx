"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

import InventoryItemCreateForm from "@/components/inventory/components/inventory-item-create-form";
import InventoryTable from "@/components/inventory/components/inventory-table";
import AppDialog from "@/components/ui/app-dialog";
import AppDialogDescription from "@/components/ui/app-dialog-description";
import AppDialogFooter from "@/components/ui/app-dialog-footer";
import AppDialogHeader from "@/components/ui/app-dialog-header";
import AppDialogTitle from "@/components/ui/app-dialog-title";
import AppSheetContent from "@/components/ui/app-sheet-content";
import FilterPills from "@/components/ui/filter-pills";
import { ActionButton } from "@/components/ui/primitives/action-button";
import { Notice } from "@/components/ui/primitives/notice";
import { PageHeader } from "@/components/ui/primitives/page-header";
import { SkeletonList } from "@/components/ui/primitives/skeleton-list";
import { INVENTORY_COPY } from "@/copy/inventory-copy";
import { INVENTORY_ITEM_CREATE_COPY } from "@/copy/inventory-item-create-copy";
import { useInventoryItemCreateDialog } from "@/lib/hooks/use-inventory-item-create-dialog";
import { useInventoryPage } from "@/lib/hooks/use-inventory-page";
import { useSearch } from "@/lib/hooks/use-search";
import { useUrlFilters } from "@/lib/hooks/use-url-filters";

const INVENTORY_FILTER_DEFAULTS = { category: "", stock: "" };

const stockOptions = [
  { label: INVENTORY_COPY.filters.all, value: "" },
  { label: INVENTORY_COPY.filters.critical, value: "critical" },
  { label: INVENTORY_COPY.filters.low, value: "low" },
  { label: INVENTORY_COPY.filters.optimal, value: "ok" },
];

export default function InventoryPageClient() {
  const router = useRouter();
  const [dialogOpen, setDialogOpen] = useState(false);
  const debouncedSearch = useSearch();
  const { filters, setFilter } = useUrlFilters(INVENTORY_FILTER_DEFAULTS);
  const dialog = useInventoryItemCreateDialog(() => setDialogOpen(false));

  const pageFilters = useMemo(
    () => ({
      category: filters.category,
      search: debouncedSearch,
      stock: filters.stock,
    }),
    [debouncedSearch, filters.category, filters.stock],
  );

  const { categories, filteredItems, inventory, summary } =
    useInventoryPage(pageFilters);

  const categoryOptions = useMemo(
    () =>
      categories.map((entry) => ({
        label: entry,
        value: entry === INVENTORY_COPY.filters.all ? "" : entry,
      })),
    [categories],
  );

  const handleDialogOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) {
      dialog.reset();
    }

    setDialogOpen(nextOpen);
  };

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="shrink-0 border-b border-border-subtle bg-canvas px-4 py-3 lg:px-8 lg:py-4">
        <div className="flex items-center justify-between gap-4">
          <PageHeader
            subtitle={INVENTORY_COPY.page.subtitle}
            title={INVENTORY_COPY.page.title}
          />
          <ActionButton
            title="Anadir material"
            onClick={() => setDialogOpen(true)}
          />
        </div>
        <div className="mt-3 space-y-2">
          {categoryOptions.length > 1 ? (
            <FilterPills
              options={categoryOptions}
              active={filters.category}
              onChange={(value) => setFilter("category", value)}
              ariaLabel={INVENTORY_COPY.filters.category}
            />
          ) : null}
          <FilterPills
            options={stockOptions}
            active={filters.stock}
            onChange={(value) => setFilter("stock", value)}
            ariaLabel={INVENTORY_COPY.filters.stock}
          />
        </div>
      </div>
      <div className="min-h-0 flex-1 space-y-6 overflow-y-auto px-4 py-4 lg:px-8 lg:py-6">
        <div className="grid gap-4 md:grid-cols-3">
          {[
            {
              label: INVENTORY_COPY.summary.critical,
              value: summary.critical,
              tone: "text-danger",
            },
            {
              label: INVENTORY_COPY.summary.low,
              value: summary.low,
              tone: "text-warning",
            },
            {
              label: INVENTORY_COPY.summary.optimal,
              value: summary.optimal,
              tone: "text-success",
            },
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
        {inventory.isLoading ? <SkeletonList /> : null}
        {inventory.error ? (
          <Notice tone="danger" message={INVENTORY_COPY.page.loadError} />
        ) : null}
        {!inventory.isLoading ? (
          <InventoryTable
            items={filteredItems}
            onRowClick={(id) => router.push(`/inventory/${id}`)}
          />
        ) : null}
      </div>
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
