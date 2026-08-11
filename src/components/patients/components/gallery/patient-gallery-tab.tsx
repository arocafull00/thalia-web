"use client";

import BeforeAfterComparison from "@/components/patients/components/before-after-comparison/before-after-comparison";
import { usePatientGallery } from "@/components/patients/components/gallery/hooks/use-patient-gallery";
import { Separator } from "@/components/ui/separator";
import type { Patient } from "@/types/database.types";

import PatientGalleryFiltersSheet from "./patient-gallery-filters-sheet";
import PatientGalleryResults from "./patient-gallery-results";
import PatientGalleryToolbar from "./patient-gallery-toolbar";
import PatientImageViewer from "./patient-image-viewer";

type PatientGalleryTabProps = {
  patient: Patient;
  onOpenUploader: () => void;
};

export default function PatientGalleryTab({
  patient,
  onOpenUploader,
}: PatientGalleryTabProps) {
  const gallery = usePatientGallery(patient.id);

  return (
    <>
      <div data-testid="patient-gallery" className="space-y-4">
        <PatientGalleryToolbar
          filters={gallery.filters}
          search={gallery.search}
          loaded={gallery.images.length}
          total={gallery.imagesQuery.total}
          density={gallery.density}
          selectionMode={gallery.selectionMode}
          selectedCount={gallery.selectedImageIds.length}
          phaseOptions={gallery.phaseOptions}
          treatmentOptions={gallery.treatmentOptions}
          onSearchChange={gallery.handleSearchChange}
          onFiltersChange={gallery.setFilters}
          onOpenFiltersSheet={gallery.handleOpenFiltersSheet}
          onDensityChange={gallery.setDensity}
          onOpenUploader={onOpenUploader}
          onStartSelection={() => gallery.setSelectionMode(true)}
          onCancelSelection={gallery.handleCloseSelectionMode}
          onCompare={() => gallery.setComparisonOpen(true)}
        />

        <Separator />

        <PatientGalleryResults
          groups={gallery.visibleGroups}
          density={gallery.density}
          images={gallery.images}
          selectionMode={gallery.selectionMode}
          selectedImageIds={gallery.selectedImageIds}
          eagerImageIds={gallery.eagerImageIds}
          isLoading={gallery.imagesQuery.isLoading}
          isLoadingMore={gallery.imagesQuery.isLoadingMore}
          hasMore={gallery.imagesQuery.hasMore}
          hasActiveFilters={gallery.hasActiveFilters}
          hasError={Boolean(gallery.imagesQuery.error)}
          hasLoadMoreError={Boolean(gallery.imagesQuery.loadMoreError)}
          onViewImage={gallery.handleOpenViewer}
          onToggleSelect={gallery.handleToggleSelect}
          onLoadMore={() => void gallery.imagesQuery.loadMore()}
          onRetry={() => void gallery.imagesQuery.refresh()}
        />
      </div>

      <PatientImageViewer
        slides={gallery.viewerSlides}
        activeIndex={gallery.viewerIndex}
        open={gallery.viewerOpen}
        onOpenChange={gallery.setViewerOpen}
        onActiveIndexChange={gallery.setViewerIndex}
      />

      {gallery.selectedImages.length === 2 ? (
        <BeforeAfterComparison
          beforeImage={gallery.selectedImages[0]!}
          afterImage={gallery.selectedImages[1]!}
          open={gallery.comparisonOpen}
          onOpenChange={gallery.setComparisonOpen}
        />
      ) : null}

      <PatientGalleryFiltersSheet
        key={gallery.sheetKey}
        open={gallery.sheetOpen}
        filters={gallery.filters}
        phaseOptions={gallery.phaseOptions}
        treatmentOptions={gallery.treatmentOptions}
        onApply={gallery.handleApplyFilters}
        onClear={gallery.handleClearFilters}
        onDismiss={() => gallery.setSheetOpen(false)}
      />
    </>
  );
}
