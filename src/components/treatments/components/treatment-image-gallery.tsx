import { Loader2, RefreshCw } from "lucide-react";

import TreatmentImageGallerySkeleton from "@/components/treatments/components/treatment-image-gallery-skeleton";
import TreatmentImageThumbnail from "@/components/treatments/components/treatment-image-thumbnail";
import type { TreatmentImageGalleryItem } from "@/components/treatments/treatment-images.types";
import { Button } from "@/components/ui/button";
import { TREATMENT_DETAIL_COPY } from "@/copy/treatment-detail-copy";

type TreatmentImageGalleryProps = {
  items: TreatmentImageGalleryItem[];
  isLoading: boolean;
  isLoadingMore: boolean;
  hasMore: boolean;
  hasError: boolean;
  onView: (imageId: string) => void;
  onLoadMore: () => void;
  onRetry: () => void;
};

export default function TreatmentImageGallery({
  items,
  isLoading,
  isLoadingMore,
  hasMore,
  hasError,
  onView,
  onLoadMore,
  onRetry,
}: TreatmentImageGalleryProps) {
  const countLabel = hasMore
    ? TREATMENT_DETAIL_COPY.images.loadedCount(items.length)
    : TREATMENT_DETAIL_COPY.images.totalCount(items.length);

  return (
    <section aria-labelledby="treatment-images-heading">
      <div className="flex items-end justify-between gap-4 border-b border-border-subtle pb-4">
        <div>
          <h2
            id="treatment-images-heading"
            className="text-sm font-medium text-ink"
          >
            {TREATMENT_DETAIL_COPY.sections.images}
          </h2>
          <p className="mt-1 text-sm text-ink-secondary">
            {TREATMENT_DETAIL_COPY.images.hint}
          </p>
        </div>
        {!isLoading && !hasError ? (
          <span className="shrink-0 text-xs text-ink-muted">{countLabel}</span>
        ) : null}
      </div>

      <div className="mt-5">
        {isLoading ? (
          <div
            aria-busy="true"
            aria-label={TREATMENT_DETAIL_COPY.images.loading}
          >
            <TreatmentImageGallerySkeleton />
          </div>
        ) : null}

        {!isLoading && hasError && items.length === 0 ? (
          <Button type="button" variant="outline" size="sm" onClick={onRetry}>
            <RefreshCw aria-hidden="true" />
            {TREATMENT_DETAIL_COPY.images.retry}
          </Button>
        ) : null}

        {!isLoading && !hasError && items.length === 0 ? (
          <p className="py-6 text-sm text-ink-secondary">
            {TREATMENT_DETAIL_COPY.images.empty}
          </p>
        ) : null}

        {items.length > 0 ? (
          <div className="grid grid-cols-2 gap-x-3 gap-y-5 sm:grid-cols-3 xl:grid-cols-4">
            {items.map((item) => (
              <TreatmentImageThumbnail
                key={item.image.id}
                item={item}
                onView={onView}
              />
            ))}
          </div>
        ) : null}

        {hasMore ? (
          <div className="mt-6 flex justify-center">
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={isLoadingMore}
              onClick={onLoadMore}
            >
              {isLoadingMore ? (
                <Loader2 className="animate-spin" aria-hidden="true" />
              ) : null}
              {TREATMENT_DETAIL_COPY.images.loadMore}
            </Button>
          </div>
        ) : null}
      </div>
    </section>
  );
}
