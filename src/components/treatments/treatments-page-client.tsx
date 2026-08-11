"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

import TreatmentDeleteConfirmDialog from "@/components/treatments/components/treatment-delete-confirm-dialog";
import TreatmentDialog from "@/components/treatments/components/treatment-dialog";
import TreatmentsFilters from "@/components/treatments/components/treatments-filters";
import TreatmentsFiltersSheet from "@/components/treatments/components/treatments-filters-sheet";
import TreatmentsTable from "@/components/treatments/components/treatments-table";
import { useTreatmentCatalog } from "@/components/treatments/hooks/use-treatment-catalog";
import { useTreatmentsPage } from "@/components/treatments/hooks/use-treatments-page";
import { TREATMENTS_COPY } from "@/components/treatments/treatments-copy";
import PageCard from "@/components/ui/page-card";
import { MobileFab } from "@/components/ui/primitives/mobile-fab";
import { Notice } from "@/components/ui/primitives/notice";
import {
  PAGE_LIST_SKELETON_ROWS,
  SkeletonList,
} from "@/components/ui/primitives/skeleton-list";
import { useFilterSearch } from "@/lib/hooks/use-filter-search";
import { useTopbarAction } from "@/lib/hooks/use-topbar-action";
import { useUrlFilters } from "@/lib/hooks/use-url-filters";
import { TREATMENTS_PAGE_SIZE } from "@/lib/treatment-pagination";
import type { TreatmentsPageQuery } from "@/stores/treatment-store";
import type { TreatmentWithInventory } from "@/types/database.types";

const TREATMENT_FILTER_DEFAULTS = { category: "", page: "", q: "" };

type TreatmentsPageClientProps = {
  initialTreatments: TreatmentWithInventory[];
  initialTotal: number;
  initialQuery: TreatmentsPageQuery;
  initialCategories: string[];
};

export default function TreatmentsPageClient({
  initialTreatments,
  initialTotal,
  initialQuery,
  initialCategories,
}: TreatmentsPageClientProps) {
  const router = useRouter();
  const [sheetOpen, setSheetOpen] = useState(false);
  const [sheetKey, setSheetKey] = useState(0);
  const { filters, setFilter, setFilters } = useUrlFilters(
    TREATMENT_FILTER_DEFAULTS,
  );
  const { searchQuery, handleSearchChange } = useFilterSearch(
    filters.q,
    setFilter,
  );
  const page = useTreatmentsPage();

  // La página vive en la URL para que un enlace compartido abra donde estaba.
  // El tope a 0 evita que un `?page=-3` escrito a mano llegue al offset del DAL.
  const pageIndex = Math.max(0, Number.parseInt(filters.page, 10) || 0);

  const pageFilters = useMemo(
    () => ({
      category: filters.category,
      page: pageIndex,
      search: searchQuery,
    }),
    [filters.category, pageIndex, searchQuery],
  );

  const { categories, category, filteredTreatments, total, treatments } =
    useTreatmentCatalog(pageFilters, {
      initialTreatments,
      initialTotal,
      initialQuery,
      initialCategories,
    });

  // Cualquier cambio de filtro vuelve a la página 1: quedarse en la 5 tras
  // filtrar deja la tabla vacía sin explicar por qué.
  const setFilterAndResetPage = (key: string, value: string) => {
    setFilters({ [key]: value, page: "" });
  };

  const categoryOptions = useMemo(
    () =>
      categories
        .filter((entry) => entry !== TREATMENTS_COPY.page.allCategories)
        .map((entry) => ({ label: entry, value: entry })),
    [categories],
  );

  const showCategoryFilter = categories.length > 1;
  const deleteTreatment = useMemo(
    () =>
      filteredTreatments.find(
        (treatment) => treatment.id === page.deleteTreatmentId,
      ) ?? null,
    [filteredTreatments, page.deleteTreatmentId],
  );

  const handleOpenFiltersSheet = () => {
    setSheetKey((key) => key + 1);
    setSheetOpen(true);
  };

  useTopbarAction({
    title: TREATMENTS_COPY.page.add,
    testId: "treatment-create-trigger",
    onClick: page.openCreateDialog,
  });

  return (
    <div data-testid="treatments-page" className="flex min-h-0 flex-1 flex-col">
      <PageCard
        filters={
          <TreatmentsFilters
            category={category}
            categoryOptions={categoryOptions}
            search={filters.q}
            showCategoryFilter={showCategoryFilter}
            isRefreshing={treatments.isRefreshing}
            onCategoryChange={(value) =>
              setFilterAndResetPage("category", value)
            }
            onSearchChange={handleSearchChange}
            onOpenSheet={handleOpenFiltersSheet}
            onRefresh={() => void treatments.refresh()}
          />
        }
      >
        {treatments.isLoading ? (
          <SkeletonList count={PAGE_LIST_SKELETON_ROWS} />
        ) : null}
        {treatments.error ? (
          <Notice tone="danger" message={TREATMENTS_COPY.page.loadError} />
        ) : null}
        {!treatments.isLoading && !treatments.error ? (
          <TreatmentsTable
            treatments={filteredTreatments}
            onRowClick={page.openEditDialog}
            onEdit={page.openEditDialog}
            onDelete={page.openDeleteDialog}
            pagination={{
              pageIndex,
              pageSize: TREATMENTS_PAGE_SIZE,
              total,
              onPageChange: (next) =>
                setFilter("page", next === 0 ? "" : String(next)),
            }}
          />
        ) : null}
      </PageCard>
      <TreatmentDialog
        open={page.dialogOpen}
        treatmentId={page.selectedTreatmentId}
        onOpenChange={(open) => {
          if (!open) {
            page.closeDialog();
          }
        }}
        onViewDetail={
          page.selectedTreatmentId
            ? () => {
                page.closeDialog();
                router.push(`/treatments/${page.selectedTreatmentId}`);
              }
            : undefined
        }
      />
      {deleteTreatment ? (
        <TreatmentDeleteConfirmDialog
          treatment={deleteTreatment}
          open
          onOpenChange={(open) => {
            if (!open) {
              page.closeDeleteDialog();
            }
          }}
          onSuccess={page.closeDeleteDialog}
        />
      ) : null}
      {showCategoryFilter ? (
        <TreatmentsFiltersSheet
          key={sheetKey}
          open={sheetOpen}
          filters={filters}
          categoryOptions={categoryOptions}
          onApply={(updates) => setFilters(updates)}
          onClear={() => setFilters(TREATMENT_FILTER_DEFAULTS)}
          onDismiss={() => setSheetOpen(false)}
        />
      ) : null}
      <MobileFab
        label={TREATMENTS_COPY.page.add}
        onClick={page.openCreateDialog}
      />
    </div>
  );
}
