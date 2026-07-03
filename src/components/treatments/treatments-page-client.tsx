"use client";

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
import { useTopbarSearchStore } from "@/stores/topbar-search-store";

export default function TreatmentsPageClient() {
  const topbarQuery = useTopbarSearchStore((state) => state.query);
  const page = useTreatmentsPage();
  const {
    categories,
    category,
    filteredTreatments,
    handleCategoryChange,
    treatments,
  } = useTreatmentCatalog(topbarQuery);

  return (
    <div className="space-y-6 p-8">
      <div className="flex items-start justify-between gap-4">
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
        <TreatmentCategoryFilter
          categories={categories}
          activeCategory={category}
          onCategoryChange={handleCategoryChange}
        />
      ) : null}

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
