"use client";

import { useMemo } from "react";

import TreatmentCategoryFilter from "@/components/treatments/components/treatment-category-filter";
import TreatmentDeleteConfirmDialog from "@/components/treatments/components/treatment-delete-confirm-dialog";
import TreatmentDialog from "@/components/treatments/components/treatment-dialog";
import TreatmentsTable from "@/components/treatments/components/treatments-table";
import { useTreatmentCatalog } from "@/components/treatments/hooks/use-treatment-catalog";
import { useTreatmentsPage } from "@/components/treatments/hooks/use-treatments-page";
import { TREATMENTS_COPY } from "@/components/treatments/treatments-copy";
import { ActionButton } from "@/components/ui/primitives/action-button";
import { Notice } from "@/components/ui/primitives/notice";
import { PageHeader } from "@/components/ui/primitives/page-header";
import { SkeletonList } from "@/components/ui/primitives/skeleton-list";
import { useSearch } from "@/lib/hooks/use-search";
import { useUrlFilters } from "@/lib/hooks/use-url-filters";

const TREATMENT_FILTER_DEFAULTS = { category: "" };

export default function TreatmentsPageClient() {
  const debouncedSearch = useSearch();
  const { filters, setFilter } = useUrlFilters(TREATMENT_FILTER_DEFAULTS);
  const page = useTreatmentsPage();

  const pageFilters = useMemo(
    () => ({
      category: filters.category,
      search: debouncedSearch,
    }),
    [debouncedSearch, filters.category],
  );

  const { categories, category, filteredTreatments, treatments } =
    useTreatmentCatalog(pageFilters);

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="shrink-0 border-b border-border-subtle bg-canvas px-4 py-3 lg:px-8 lg:py-4">
        <div className="flex items-center justify-between gap-4">
          <PageHeader
            title={TREATMENTS_COPY.page.title}
            subtitle={TREATMENTS_COPY.page.subtitle}
          />
          <ActionButton
            title={TREATMENTS_COPY.page.add}
            onClick={page.openCreateDialog}
          />
        </div>
        {categories.length > 1 ? (
          <div className="mt-3">
            <TreatmentCategoryFilter
              categories={categories}
              activeCategory={category}
              onCategoryChange={(value) => setFilter("category", value)}
            />
          </div>
        ) : null}
      </div>
      <div className="min-h-0 flex-1 space-y-6 overflow-y-auto px-4 py-4 lg:px-8 lg:py-6">
        {treatments.isLoading ? <SkeletonList /> : null}
        {treatments.error ? (
          <Notice tone="danger" message={TREATMENTS_COPY.page.loadError} />
        ) : null}
        {!treatments.isLoading && !treatments.error ? (
          <TreatmentsTable
            treatments={filteredTreatments}
            onEdit={page.openEditDialog}
            onDelete={page.openDeleteDialog}
          />
        ) : null}
      </div>
      <TreatmentDialog
        open={page.dialogOpen}
        treatmentId={page.selectedTreatmentId}
        onOpenChange={(open) => {
          if (!open) {
            page.closeDialog();
          }
        }}
      />

      {page.treatmentToDelete ? (
        <TreatmentDeleteConfirmDialog
          treatment={page.treatmentToDelete}
          open={page.deleteDialogOpen}
          onOpenChange={(open) => {
            if (!open) {
              page.closeDeleteDialog();
            }
          }}
          onSuccess={page.closeDeleteDialog}
        />
      ) : null}
    </div>
  );
}
