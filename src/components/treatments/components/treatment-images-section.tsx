"use client";

import PatientImageViewer from "@/components/patients/components/gallery/patient-image-viewer";
import TreatmentImageGallery from "@/components/treatments/components/treatment-image-gallery";
import { useTreatmentImages } from "@/components/treatments/hooks/use-treatment-images";

type TreatmentImagesSectionProps = {
  treatmentId: string;
};

export default function TreatmentImagesSection({
  treatmentId,
}: TreatmentImagesSectionProps) {
  const gallery = useTreatmentImages(treatmentId);

  return (
    <>
      <TreatmentImageGallery
        items={gallery.items}
        isLoading={gallery.isLoading}
        isLoadingMore={gallery.isLoadingMore}
        hasMore={gallery.hasMore}
        hasError={gallery.hasError}
        onView={gallery.openViewer}
        onLoadMore={gallery.loadMore}
        onRetry={gallery.retry}
      />

      <PatientImageViewer
        slides={gallery.slides}
        activeIndex={gallery.viewerIndex}
        open={gallery.viewerOpen}
        onOpenChange={gallery.setViewerOpen}
        onActiveIndexChange={gallery.setViewerIndex}
      />
    </>
  );
}
