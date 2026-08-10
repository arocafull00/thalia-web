"use client";

import { Loader2, RefreshCw } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Notice } from "@/components/ui/primitives/notice";
import { PATIENT_GALLERY_COPY } from "@/copy/patient-gallery-copy";
import type { PatientGalleryDensity } from "@/lib/patient-gallery-density";
import type { PatientGalleryDateGroup as PatientGalleryDateGroupType } from "@/lib/patient-gallery-grouping";
import type { PatientImage } from "@/types/database.types";

import PatientGalleryDateGroup from "./patient-gallery-date-group";
import PatientGallerySkeleton from "./patient-gallery-skeleton";

type PatientGalleryResultsProps = {
  groups: PatientGalleryDateGroupType[];
  density: PatientGalleryDensity;
  images: PatientImage[];
  selectionMode: boolean;
  selectedImageIds: string[];
  eagerImageIds: Set<string>;
  isLoading: boolean;
  isLoadingMore: boolean;
  hasMore: boolean;
  hasActiveFilters: boolean;
  hasError: boolean;
  hasLoadMoreError: boolean;
  onViewImage: (image: PatientImage) => void;
  onToggleSelect: (image: PatientImage) => void;
  onLoadMore: () => void;
  onRetry: () => void;
};

export default function PatientGalleryResults({
  groups,
  density,
  images,
  selectionMode,
  selectedImageIds,
  eagerImageIds,
  isLoading,
  isLoadingMore,
  hasMore,
  hasActiveFilters,
  hasError,
  hasLoadMoreError,
  onViewImage,
  onToggleSelect,
  onLoadMore,
  onRetry,
}: PatientGalleryResultsProps) {
  if (isLoading) {
    return <PatientGallerySkeleton />;
  }

  if (hasError && images.length === 0) {
    return (
      <div className="space-y-3">
        <Notice tone="danger" message={PATIENT_GALLERY_COPY.errors.load} />
        <Button type="button" variant="outline" size="sm" onClick={onRetry}>
          <RefreshCw aria-hidden="true" />
          {PATIENT_GALLERY_COPY.errors.retry}
        </Button>
      </div>
    );
  }

  if (!hasError && images.length === 0) {
    return (
      <p className="py-8 text-center text-sm text-ink-secondary">
        {hasActiveFilters
          ? PATIENT_GALLERY_COPY.empty
          : PATIENT_GALLERY_COPY.emptyGallery}
      </p>
    );
  }

  return (
    <div className="space-y-8">
      {groups.map((group) => (
        <PatientGalleryDateGroup
          key={group.dateGroupLabel}
          label={group.dateGroupLabel}
          images={group.images}
          density={density}
          selectionMode={selectionMode}
          selectedImageIds={selectedImageIds}
          eagerImageIds={eagerImageIds}
          onViewImage={onViewImage}
          onToggleSelect={onToggleSelect}
        />
      ))}

      {hasLoadMoreError ? (
        <Notice tone="danger" message={PATIENT_GALLERY_COPY.errors.loadMore} />
      ) : null}

      {hasMore ? (
        <div className="flex justify-center">
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={isLoadingMore}
            data-testid="patient-gallery-load-more"
            onClick={onLoadMore}
          >
            {isLoadingMore ? (
              <Loader2 className="animate-spin" aria-hidden="true" />
            ) : null}
            {hasLoadMoreError
              ? PATIENT_GALLERY_COPY.errors.retry
              : PATIENT_GALLERY_COPY.loadMore}
          </Button>
        </div>
      ) : null}
    </div>
  );
}
