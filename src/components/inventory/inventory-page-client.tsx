"use client";

import { useRouter } from "next/navigation";
import { useCallback, useMemo, useState } from "react";

import InventoryItemCreateForm from "@/components/inventory/components/form/inventory-item-create-form";
import InventoryItemEditDialog from "@/components/inventory/components/form/inventory-item-edit-dialog";
import InventoryFilters from "@/components/inventory/components/list/inventory-filters";
import InventoryFiltersSheet from "@/components/inventory/components/list/inventory-filters-sheet";
import InventoryStockSummary from "@/components/inventory/components/list/inventory-stock-summary";
import InventoryTable from "@/components/inventory/components/list/inventory-table";
import AppDialog from "@/components/ui/app-dialog";
import AppDialogDescription from "@/components/ui/app-dialog-description";
import AppDialogFooter from "@/components/ui/app-dialog-footer";
import AppDialogHeader from "@/components/ui/app-dialog-header";
import AppDialogTitle from "@/components/ui/app-dialog-title";
import AppSheetContent from "@/components/ui/app-sheet-content";
import { Button } from "@/components/ui/button";
import PageCard from "@/components/ui/page-card";
import { ActionButton } from "@/components/ui/primitives/action-button";
import {
  FORM_ACTION_ICONS,
  FORM_ACTION_ICON_CLASS,
} from "@/components/ui/primitives/form-action-icons";
import { MobileFab } from "@/components/ui/primitives/mobile-fab";
import { Notice } from "@/components/ui/primitives/notice";
import {
  PAGE_LIST_SKELETON_ROWS,
  SkeletonList,
} from "@/components/ui/primitives/skeleton-list";
import { INVENTORY_COPY } from "@/copy/inventory-copy";
import { INVENTORY_ITEM_CREATE_COPY } from "@/copy/inventory-item-create-copy";
import type {
  InventoryPageResult,
  InventoryStockSummary as InventoryStockSummaryValue,
} from "@/dal/inventory.dal";
import { useFilterSearch } from "@/lib/hooks/use-filter-search";
import { useInventoryItemCreateDialog } from "@/lib/hooks/use-inventory-item-create-dialog";
import { useInventoryPage } from "@/lib/hooks/use-inventory-page";
import { useTopbarAction } from "@/lib/hooks/use-topbar-action";
import { useUrlFilters } from "@/lib/hooks/use-url-filters";
import { INVENTORY_PAGE_SIZE } from "@/lib/inventory-pagination";
import type { InventoryPageQuery } from "@/stores/inventory-store";

const INVENTORY_FILTER_DEFAULTS = { category: "", page: "", q: "", stock: "" };

type InventoryPageClientProps = {
  initialPage: InventoryPageResult;
  initialQuery: InventoryPageQuery;
  initialCategories: string[];
  initialSummary: InventoryStockSummaryValue;
};

export default function InventoryPageClient({
  initialPage,
  initialQuery,
  initialCategories,
  initialSummary,
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

  // Cualquier cambio de filtro, búsqueda incluida, vuelve a la página 1:
  // quedarse en la 5 tras filtrar deja la tabla vacía sin explicar por qué.
  const setFilterAndResetPage = useCallback(
    (key: string, value: string) => {
      setFilters({ [key]: value, page: "" });
    },
    [setFilters],
  );

  const { searchQuery, handleSearchChange } = useFilterSearch(
    filters.q,
    setFilterAndResetPage,
  );

  // La página vive en la URL para que un enlace compartido abra donde estaba.
  // El tope a 0 evita que un `?page=-3` escrito a mano llegue al offset del DAL.
  const pageIndex = Math.max(0, Number.parseInt(filters.page, 10) || 0);
  const dialog = useInventoryItemCreateDialog(() => setDialogOpen(false));

  const pageFilters = useMemo(
    () => ({
      category: filters.category,
      page: pageIndex,
      search: searchQuery,
      stock: filters.stock,
    }),
    [filters.category, filters.stock, pageIndex, searchQuery],
  );

  const { categories, items, inventory, summary, total } = useInventoryPage(
    pageFilters,
    { initialPage, initialQuery, initialCategories, initialSummary },
  );

  const editingItem = useMemo(
    () => items.find((item) => item.id === editingItemId),
    [editingItemId, items],
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
      <PageCard
        filters={
          <InventoryFilters
            category={filters.category}
            categoryOptions={categoryOptions}
            search={filters.q}
            stock={filters.stock}
            onCategoryChange={(value) =>
              setFilterAndResetPage("category", value)
            }
            onSearchChange={handleSearchChange}
            onStockChange={(value) => setFilterAndResetPage("stock", value)}
            onOpenSheet={handleOpenFiltersSheet}
          />
        }
      >
        <InventoryStockSummary
          summary={summary}
          activeStock={filters.stock}
          onStockChange={(value) => setFilterAndResetPage("stock", value)}
        />
        {inventory.isLoading ? (
          <SkeletonList count={PAGE_LIST_SKELETON_ROWS} />
        ) : null}
        {inventory.error ? (
          <Notice tone="danger" message={INVENTORY_COPY.page.loadError} />
        ) : null}
        {!inventory.isLoading ? (
          <InventoryTable
            items={items}
            onRowClick={handleRowClick}
            onEdit={handleRowClick}
            pagination={{
              pageIndex,
              pageSize: INVENTORY_PAGE_SIZE,
              total,
              onPageChange: (next) =>
                setFilter("page", next === 0 ? "" : String(next)),
            }}
          />
        ) : null}
      </PageCard>
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
              <FORM_ACTION_ICONS.cancel
                className={FORM_ACTION_ICON_CLASS}
                aria-hidden="true"
              />
              {INVENTORY_ITEM_CREATE_COPY.actions.cancel}
            </Button>
            <ActionButton
              icon={FORM_ACTION_ICONS.save}
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
        onApply={(updates) => setFilters({ ...updates, page: "" })}
        onClear={() => setFilters(INVENTORY_FILTER_DEFAULTS)}
        onDismiss={() => setSheetOpen(false)}
      />
      <MobileFab label="Anadir material" onClick={() => setDialogOpen(true)} />
    </div>
  );
}
