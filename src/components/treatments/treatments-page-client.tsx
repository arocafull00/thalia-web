"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

import TreatmentDialog from "@/components/treatments/components/treatment-dialog";
import TreatmentsFilters from "@/components/treatments/components/treatments-filters";
import TreatmentsFiltersSheet from "@/components/treatments/components/treatments-filters-sheet";
import TreatmentsTable from "@/components/treatments/components/treatments-table";
import { useTreatmentCatalog } from "@/components/treatments/hooks/use-treatment-catalog";
import { useTreatmentsPage } from "@/components/treatments/hooks/use-treatments-page";
import { TREATMENTS_COPY } from "@/components/treatments/treatments-copy";
import PageStickyFiltersSection from "@/components/ui/page-sticky-filters-section";
import { MobileFab } from "@/components/ui/primitives/mobile-fab";
import { Notice } from "@/components/ui/primitives/notice";
import { SkeletonList } from "@/components/ui/primitives/skeleton-list";
import { useFilterSearch } from "@/lib/hooks/use-filter-search";
import { useTopbarAction } from "@/lib/hooks/use-topbar-action";
import { useUrlFilters } from "@/lib/hooks/use-url-filters";

const TREATMENT_FILTER_DEFAULTS = { category: "", q: "" };

export default function TreatmentsPageClient() {
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

  const pageFilters = useMemo(
    () => ({
      category: filters.category,
      search: searchQuery,
    }),
    [filters.category, searchQuery],
  );

  const { categories, category, filteredTreatments, treatments } =
    useTreatmentCatalog(pageFilters);

  const categoryOptions = useMemo(
    () =>
      categories
        .filter((entry) => entry !== TREATMENTS_COPY.page.allCategories)
        .map((entry) => ({ label: entry, value: entry })),
    [categories],
  );

  const showCategoryFilter = categories.length > 1;

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
      <div className="min-h-0 flex-1 overflow-y-auto">
        <PageStickyFiltersSection>
          <TreatmentsFilters
            category={category}
            categoryOptions={categoryOptions}
            search={filters.q}
            showCategoryFilter={showCategoryFilter}
            onCategoryChange={(value) => setFilter("category", value)}
            onSearchChange={handleSearchChange}
            onOpenSheet={handleOpenFiltersSheet}
          />
        </PageStickyFiltersSection>
        <div className="space-y-6 px-4 py-4 lg:px-8 lg:py-6">
          {treatments.isLoading ? <SkeletonList /> : null}
          {treatments.error ? (
            <Notice tone="danger" message={TREATMENTS_COPY.page.loadError} />
          ) : null}
          {!treatments.isLoading && !treatments.error ? (
            <TreatmentsTable
              treatments={filteredTreatments}
              onRowClick={page.openEditDialog}
            />
          ) : null}
        </div>
      </div>
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
