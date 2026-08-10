import { useCallback, useEffect, useMemo, useState } from "react";

import { PATIENT_GALLERY_COPY } from "@/copy/patient-gallery-copy";
import {
  getImageUrl,
  type PatientImagesFilters,
} from "@/dal/patient-images.dal";
import { useClinicId } from "@/lib/hooks/use-active-clinic";
import { peekCachedPatientImageUrl } from "@/lib/patient-image-storage";
import { usePatientImagesStore } from "@/stores/patient-images-store";
import type { PatientImage } from "@/types/database.types";

export type PatientImageViewerSlide = {
  src: string;
  alt: string;
};

export function usePatientImages(
  patientId: string,
  filters: PatientImagesFilters,
) {
  const clinicId = useClinicId();
  const entry = usePatientImagesStore(
    (state) => state.imagesByPatientId[patientId],
  );
  const fetchPatientImages = usePatientImagesStore(
    (state) => state.fetchPatientImages,
  );
  const loadMorePatientImages = usePatientImagesStore(
    (state) => state.loadMorePatientImages,
  );
  const refreshPatientImages = usePatientImagesStore(
    (state) => state.refreshPatientImages,
  );

  useEffect(() => {
    if (!patientId.trim()) {
      return;
    }

    void fetchPatientImages(patientId, filters);
  }, [clinicId, fetchPatientImages, filters, patientId]);

  const matchesCurrentQuery =
    entry?.clinicId === clinicId &&
    JSON.stringify(entry.filters) === JSON.stringify(filters);
  const currentEntry = matchesCurrentQuery ? entry : undefined;

  return {
    data: currentEntry?.data ?? undefined,
    total: currentEntry?.total ?? 0,
    hasMore: currentEntry?.hasMore ?? false,
    isLoading:
      currentEntry == null ||
      (currentEntry.loading && currentEntry.data === null),
    isRefreshing: currentEntry?.loading ?? false,
    isLoadingMore: currentEntry?.loadingMore ?? false,
    error: currentEntry?.error,
    loadMoreError: currentEntry?.loadMoreError,
    loadMore: () => loadMorePatientImages(patientId),
    refresh: () => refreshPatientImages(patientId),
  };
}

export function useUploadPatientImages() {
  const uploadPatientImages = usePatientImagesStore(
    (state) => state.uploadPatientImages,
  );
  const isPending = usePatientImagesStore((state) => state.uploading);
  const progress = usePatientImagesStore((state) => state.uploadProgress);
  const currentFile = usePatientImagesStore((state) => state.uploadCurrentFile);
  const totalFiles = usePatientImagesStore((state) => state.uploadTotalFiles);
  const error = usePatientImagesStore((state) => state.uploadError);

  const mutateAsync = useCallback(
    (input: Parameters<typeof uploadPatientImages>[0]) =>
      uploadPatientImages(input),
    [uploadPatientImages],
  );

  return { mutateAsync, isPending, progress, currentFile, totalFiles, error };
}

export function useDeletePatientImage() {
  const deletePatientImage = usePatientImagesStore(
    (state) => state.deletePatientImage,
  );
  const deletingId = usePatientImagesStore((state) => state.deletingId);
  const error = usePatientImagesStore((state) => state.deleteError);

  const mutateAsync = useCallback(
    ({ patientId, image }: { patientId: string; image: PatientImage }) =>
      deletePatientImage(patientId, image),
    [deletePatientImage],
  );

  return {
    mutateAsync,
    isPending: deletingId !== null,
    deletingId,
    error,
  };
}

export function usePatientImageUrl(image: PatientImage | null) {
  const cachedUrl = image ? peekCachedPatientImageUrl(image.storage_key) : null;
  const [asyncUrl, setAsyncUrl] = useState<{
    key: string;
    url: string | null;
  } | null>(null);

  useEffect(() => {
    if (!image) {
      return;
    }

    if (peekCachedPatientImageUrl(image.storage_key)) {
      return;
    }

    let cancelled = false;

    getImageUrl(image)
      .then((resolvedUrl) => {
        if (!cancelled) {
          setAsyncUrl({ key: image.storage_key, url: resolvedUrl });
        }
      })
      .catch(() => {
        if (!cancelled) {
          setAsyncUrl({ key: image.storage_key, url: null });
        }
      });

    return () => {
      cancelled = true;
    };
  }, [image]);

  if (!image) {
    return null;
  }

  if (cachedUrl) {
    return cachedUrl;
  }

  if (asyncUrl?.key === image.storage_key) {
    return asyncUrl.url;
  }

  return null;
}

export function usePatientImageViewerSlides(
  images: PatientImage[],
): PatientImageViewerSlide[] {
  const imageKeys = useMemo(
    () => images.map((image) => image.storage_key).join("\0"),
    [images],
  );
  const [urlByKey, setUrlByKey] = useState<Record<string, string>>({});

  useEffect(() => {
    let cancelled = false;

    void (async () => {
      const results = await Promise.all(
        images.map(async (image) => {
          const cached = peekCachedPatientImageUrl(image.storage_key);

          if (cached) {
            return [image.storage_key, cached] as const;
          }

          try {
            const url = await getImageUrl(image);
            return [image.storage_key, url] as const;
          } catch {
            return null;
          }
        }),
      );

      if (cancelled) {
        return;
      }

      const updates = Object.fromEntries(
        results.filter(
          (entry): entry is readonly [string, string] => entry !== null,
        ),
      );

      setUrlByKey((current) => {
        const hasNew = Object.entries(updates).some(
          ([key, url]) => current[key] !== url,
        );

        if (!hasNew) {
          return current;
        }

        return { ...current, ...updates };
      });
    })();

    return () => {
      cancelled = true;
    };
  }, [imageKeys, images]);

  return useMemo(
    () =>
      images.map((image) => ({
        src:
          peekCachedPatientImageUrl(image.storage_key) ??
          urlByKey[image.storage_key] ??
          "",
        alt: image.original_filename ?? PATIENT_GALLERY_COPY.title,
      })),
    [images, urlByKey],
  );
}
