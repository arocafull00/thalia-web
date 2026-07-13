import { useCallback, useEffect, useMemo, useState } from "react";

import { PATIENT_GALLERY_COPY } from "@/copy/patient-gallery-copy";
import { getImageUrl } from "@/dal/patient-images.dal";
import { peekCachedPatientImageUrl } from "@/lib/patient-image-storage";
import { usePatientImagesStore } from "@/stores/patient-images-store";
import { isInitialLoading } from "@/stores/query-state";
import type { PatientImage } from "@/types/database.types";

export type PatientImageViewerSlide = {
  src: string;
  alt: string;
};

export function usePatientImages(patientId: string) {
  const entry = usePatientImagesStore(
    (state) => state.imagesByPatientId[patientId],
  );
  const fetchPatientImages = usePatientImagesStore(
    (state) => state.fetchPatientImages,
  );

  useEffect(() => {
    if (!patientId.trim()) {
      return;
    }

    void fetchPatientImages(patientId);
  }, [fetchPatientImages, patientId]);

  return {
    data: entry?.data ?? undefined,
    isLoading: isInitialLoading(entry),
    error: entry?.error,
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
