"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

import InventoryItemCreateForm from "@/components/inventory/components/form/inventory-item-create-form";
import InventoryItemEditDialog from "@/components/inventory/components/form/inventory-item-edit-dialog";
import InventoryFilters from "@/components/inventory/components/list/inventory-filters";
import InventoryFiltersSheet from "@/components/inventory/components/list/inventory-filters-sheet";
import InventoryTable from "@/components/inventory/components/list/inventory-table";
import AppDialog from "@/components/ui/app-dialog";
import AppDialogDescription from "@/components/ui/app-dialog-description";
import AppDialogFooter from "@/components/ui/app-dialog-footer";
import AppDialogHeader from "@/components/ui/app-dialog-header";
import AppDialogTitle from "@/components/ui/app-dialog-title";
import AppSheetContent from "@/components/ui/app-sheet-content";
import { Button } from "@/components/ui/button";
import PageStickyFiltersSection from "@/components/ui/page-sticky-filters-section";
import { ActionButton } from "@/components/ui/primitives/action-button";
import { MobileFab } from "@/components/ui/primitives/mobile-fab";
import { Notice } from "@/components/ui/primitives/notice";
import { SkeletonList } from "@/components/ui/primitives/skeleton-list";
import { Stat } from "@/components/ui/primitives/stat";
import { INVENTORY_COPY } from "@/copy/inventory-copy";
import { INVENTORY_ITEM_CREATE_COPY } from "@/copy/inventory-item-create-copy";
import { useFilterSearch } from "@/lib/hooks/use-filter-search";
import { useInventoryItemCreateDialog } from "@/lib/hooks/use-inventory-item-create-dialog";
import { useInventoryPage } from "@/lib/hooks/use-inventory-page";
import { useTopbarAction } from "@/lib/hooks/use-topbar-action";
import { useUrlFilters } from "@/lib/hooks/use-url-filters";
import type { InventoryItem } from "@/types/database.types";

const INVENTORY_FILTER_DEFAULTS = { category: "", q: "", stock: "" };

type InventoryPageClientProps = {
  initialItems: InventoryItem[];
};

export default function InventoryPageClient({
  initialItems,
}: InventoryPageClientProps) {
  const router = useRouter();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [sheetKey, setSheetKey] = useState(0);
  const { filters, setFilter, setFilters } = useUrlFilters(
    INVENTORY_FILTER_DEFAULTS,
  );
  const { searchQuery, handleSearchChange } = useFilterSearch(
    filters.q,
    setFilter,
  );
  const dialog = useInventoryItemCreateDialog(() => setDialogOpen(false));

  const pageFilters = useMemo(
    () => ({
      category: filters.category,
      search: searchQuery,
      stock: filters.stock,
    }),
    [filters.category, filters.stock, searchQuery],
  );

  const { categories, filteredItems, inventory, summary } = useInventoryPage(
    pageFilters,
    initialItems,
  );

  const editingItem = useMemo(
    () => filteredItems.find((item) => item.id === editingItemId),
    [editingItemId, filteredItems],
  );

  const categoryOptions = useMemo(
    () =>
      categories
        .filter((entry) => entry !== INVENTORY_COPY.filters.all)
        .map((entry) => ({ label: entry, value: entry })),
    [categories],
  );

  const handleDialogOpenChange = (nextOpen: boolean) => {
    setDialogOpen(nextOpen);
  };

  const handleCancelCreate = () => {
    dialog.reset();
    setDialogOpen(false);
  };

  const handleOpenFiltersSheet = () => {
    setSheetKey((key) => key + 1);
    setSheetOpen(true);
  };

  const handleEditDialogOpenChange = (nextOpen: boolean) => {
    setEditDialogOpen(nextOpen);
  };

  const handleRowClick = (id: string) => {
    setEditingItemId(id);
    setEditDialogOpen(true);
  };

  useTopbarAction({
    title: "Anadir material",
    testId: "inventory-create-trigger",
    onClick: () => setDialogOpen(true),
  });

  return (
    <div data-testid="inventory-page" className="flex min-h-0 flex-1 flex-col">
      <div className="min-h-0 flex-1 overflow-y-auto">
        <PageStickyFiltersSection>
          <InventoryFilters
            category={filters.category}
            categoryOptions={categoryOptions}
            search={filters.q}
            stock={filters.stock}
            onCategoryChange={(value) => setFilter("category", value)}
            onSearchChange={handleSearchChange}
            onStockChange={(value) => setFilter("stock", value)}
            onOpenSheet={handleOpenFiltersSheet}
          />
        </PageStickyFiltersSection>
        <div className="space-y-6 px-4 py-4 lg:px-8 lg:py-6">
          <div className="grid w-full px-3 grid-cols-3 divide-x divide-border-subtle">
            <Stat
              label={INVENTORY_COPY.summary.critical}
              value={summary.critical}
              tone="danger"
            />
            <Stat
              label={INVENTORY_COPY.summary.low}
              value={summary.low}
              tone="warning"
            />
            <Stat
              label={INVENTORY_COPY.summary.optimal}
              value={summary.optimal}
              tone="success"
            />
          </div>
          {inventory.isLoading ? <SkeletonList /> : null}
          {inventory.error ? (
            <Notice tone="danger" message={INVENTORY_COPY.page.loadError} />
          ) : null}
          {!inventory.isLoading ? (
            <InventoryTable items={filteredItems} onRowClick={handleRowClick} />
          ) : null}
        </div>
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
            <Button
              type="button"
              variant="outline"
              onClick={handleCancelCreate}
              className="rounded-button px-3 py-1.5 text-sm"
            >
              {INVENTORY_ITEM_CREATE_COPY.actions.cancel}
            </Button>
            <ActionButton
              title={
                dialog.isPending
                  ? INVENTORY_ITEM_CREATE_COPY.actions.saving
                  : INVENTORY_ITEM_CREATE_COPY.actions.save
              }
              disabled={dialog.isPending}
              testId="inventory-create-submit"
              onClick={dialog.handleSubmit}
            />
          </AppDialogFooter>
        </AppSheetContent>
      </AppDialog>
      {editingItem ? (
        <InventoryItemEditDialog
          item={editingItem}
          open={editDialogOpen}
          onOpenChange={handleEditDialogOpenChange}
          onSuccess={() => {}}
          onViewDetail={() => {
            handleEditDialogOpenChange(false);
            router.push(`/inventory/${editingItem.id}`);
          }}
        />
      ) : null}
      <InventoryFiltersSheet
        key={sheetKey}
        open={sheetOpen}
        filters={filters}
        categoryOptions={categoryOptions}
        onApply={(updates) => setFilters(updates)}
        onClear={() => setFilters(INVENTORY_FILTER_DEFAULTS)}
        onDismiss={() => setSheetOpen(false)}
      />
      <MobileFab label="Anadir material" onClick={() => setDialogOpen(true)} />
    </div>
  );
}
