import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";

import type { TreatmentImageGalleryItem } from "@/components/treatments/treatment-images.types";
import { TREATMENT_DETAIL_COPY } from "@/copy/treatment-detail-copy";
import { useClinicId } from "@/lib/hooks/use-active-clinic";
import { usePatientImageViewerSlides } from "@/lib/hooks/use-patient-images";
import { useTreatmentImagesStore } from "@/stores/treatment-images-store";
import type { PatientImageWithPatient } from "@/types/database.types";

const EMPTY_IMAGES: PatientImageWithPatient[] = [];

export function useTreatmentImages(treatmentId: string) {
  const clinicId = useClinicId();
  const entry = useTreatmentImagesStore(
    (state) => state.byTreatmentId[treatmentId],
  );
  const fetchTreatmentImages = useTreatmentImagesStore(
    (state) => state.fetchTreatmentImages,
  );
  const loadMoreTreatmentImages = useTreatmentImagesStore(
    (state) => state.loadMoreTreatmentImages,
  );
  const [viewerOpen, setViewerOpen] = useState(false);
  const [viewerIndex, setViewerIndex] = useState(0);
  const currentEntry = entry?.clinicId === clinicId ? entry : undefined;
  const images = currentEntry?.data ?? EMPTY_IMAGES;
  const resolvedSlides = usePatientImageViewerSlides(images);

  useEffect(() => {
    if (!clinicId || !treatmentId.trim()) {
      return;
    }

    void fetchTreatmentImages(treatmentId);
  }, [clinicId, fetchTreatmentImages, treatmentId]);

  useEffect(() => {
    if (!currentEntry?.error) {
      return;
    }

    toast.error(TREATMENT_DETAIL_COPY.errors.loadImages, {
      toastId: `treatment-images-${treatmentId}`,
    });
  }, [currentEntry?.error, treatmentId]);

  const slides = useMemo(
    () =>
      resolvedSlides.map((slide, index) => {
        const patientName =
          images[index]?.patients?.full_name ??
          TREATMENT_DETAIL_COPY.images.unknownPatient;

        return {
          ...slide,
          alt: TREATMENT_DETAIL_COPY.images.imageAlt(patientName),
        };
      }),
    [images, resolvedSlides],
  );

  const items = useMemo<TreatmentImageGalleryItem[]>(
    () =>
      images.map((image, index) => {
        const patientName =
          image.patients?.full_name ??
          TREATMENT_DETAIL_COPY.images.unknownPatient;

        return {
          image,
          src: slides[index]?.src ?? "",
          alt: slides[index]?.alt ?? "",
          patientName,
        };
      }),
    [images, slides],
  );

  const openViewer = useCallback(
    (imageId: string) => {
      const index = images.findIndex((image) => image.id === imageId);

      if (index === -1) {
        return;
      }

      setViewerIndex(index);
      setViewerOpen(true);
    },
    [images],
  );

  const loadMore = useCallback(() => {
    void loadMoreTreatmentImages(treatmentId);
  }, [loadMoreTreatmentImages, treatmentId]);

  const retry = useCallback(() => {
    void fetchTreatmentImages(treatmentId);
  }, [fetchTreatmentImages, treatmentId]);

  return {
    items,
    slides,
    isLoading:
      currentEntry === undefined ||
      (currentEntry.data === null && currentEntry.loading),
    isLoadingMore: currentEntry?.loadingMore ?? false,
    hasMore: currentEntry?.hasMore ?? false,
    hasError: currentEntry?.error != null,
    viewerOpen,
    viewerIndex,
    openViewer,
    setViewerOpen,
    setViewerIndex,
    loadMore,
    retry,
  };
}
