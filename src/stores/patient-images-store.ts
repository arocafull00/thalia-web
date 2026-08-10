import { fromZonedTime } from "date-fns-tz";
import { create } from "zustand";

import {
  createPatientImage,
  deletePatientImage as deletePatientImageDal,
  getPatientImagesPage,
  PATIENT_IMAGES_PAGE_SIZE,
  type PatientImagesFilters,
} from "@/dal/patient-images.dal";
import { getActiveClinicId } from "@/lib/active-clinic-id";
import { CLINIC_TIME_ZONE } from "@/lib/constants";
import {
  compressTreatmentImage,
  getImageDimensions,
} from "@/lib/image-compression";
import { logger } from "@/lib/logger";
import {
  buildPatientImageKey,
  uploadPatientImageObject,
} from "@/lib/patient-image-storage";
import type { PatientImageUploadInput } from "@/lib/schemas/patient-image-schema";
import type { PatientImage } from "@/types/database.types";

type PatientImageDeleteConfirmState = {
  image: PatientImage;
  onSuccess: (() => void) | null;
};

type UploadPatientImageInput = {
  clinicId: string;
  patientId: string;
  file: File;
  metadata: PatientImageUploadInput;
};

type UploadPatientImagesInput = {
  clinicId: string;
  patientId: string;
  files: File[];
  metadata: PatientImageUploadInput;
};

export type PatientImagesEntry = {
  clinicId: string;
  queryKey: string;
  requestId: string;
  filters: PatientImagesFilters;
  data: PatientImage[] | null;
  total: number;
  loading: boolean;
  loadingMore: boolean;
  hasMore: boolean;
  error: Error | null;
  loadMoreError: Error | null;
};

type PatientImagesStore = {
  imagesByPatientId: Record<string, PatientImagesEntry>;
  uploading: boolean;
  uploadProgress: number;
  uploadCurrentFile: number;
  uploadTotalFiles: number;
  uploadError: Error | null;
  deletingId: string | null;
  deleteError: Error | null;
  deleteConfirm: PatientImageDeleteConfirmState | null;
  fetchPatientImages: (
    patientId: string,
    filters: PatientImagesFilters,
    force?: boolean,
  ) => Promise<void>;
  loadMorePatientImages: (patientId: string) => Promise<void>;
  refreshPatientImages: (patientId: string) => Promise<void>;
  uploadPatientImage: (input: UploadPatientImageInput) => Promise<PatientImage>;
  uploadPatientImages: (
    input: UploadPatientImagesInput,
  ) => Promise<PatientImage[]>;
  deletePatientImage: (patientId: string, image: PatientImage) => Promise<void>;
  openDeleteConfirm: (image: PatientImage, onSuccess?: () => void) => void;
  closeDeleteConfirm: () => void;
};

function patientImagesQueryKey(
  clinicId: string,
  patientId: string,
  filters: PatientImagesFilters,
) {
  return JSON.stringify({ clinicId, patientId, ...filters });
}

function toError(cause: unknown) {
  return cause instanceof Error ? cause : new Error(String(cause));
}

async function uploadSinglePatientImage(
  { clinicId, patientId, file, metadata }: UploadPatientImageInput,
  capturedAt: string,
  onProgress: (progress: number) => void,
): Promise<PatientImage> {
  const compressedFile = await compressTreatmentImage(file);
  const { width, height } = await getImageDimensions(compressedFile);
  const imageId = crypto.randomUUID();
  const storageKey = buildPatientImageKey(clinicId, patientId, imageId, "webp");

  await uploadPatientImageObject(
    storageKey,
    compressedFile,
    "image/webp",
    onProgress,
  );

  return createPatientImage({
    patient_id: patientId,
    clinic_id: clinicId,
    storage_key: storageKey,
    original_filename: file.name,
    mime_type: "image/webp",
    file_size_bytes: compressedFile.size,
    width,
    height,
    phase: metadata.phase,
    treatment_id: metadata.treatment_id,
    notes: metadata.notes,
    captured_at: capturedAt,
  });
}

function resolveCapturedAt(metadata: PatientImageUploadInput) {
  if (!metadata.captured_at) {
    return new Date().toISOString();
  }

  return fromZonedTime(
    `${metadata.captured_at}T12:00:00`,
    CLINIC_TIME_ZONE,
  ).toISOString();
}

export const usePatientImagesStore = create<PatientImagesStore>((set, get) => ({
  imagesByPatientId: {},
  uploading: false,
  uploadProgress: 0,
  uploadCurrentFile: 0,
  uploadTotalFiles: 0,
  uploadError: null,
  deletingId: null,
  deleteError: null,
  deleteConfirm: null,

  fetchPatientImages: async (patientId, filters, force = false) => {
    const clinicId = getActiveClinicId();

    if (!clinicId) {
      return;
    }

    const queryKey = patientImagesQueryKey(clinicId, patientId, filters);
    const requestId = crypto.randomUUID();
    const current = get().imagesByPatientId[patientId];
    const previous = current?.queryKey === queryKey ? current : undefined;

    if (previous?.loading && !force) {
      return;
    }

    set({
      imagesByPatientId: {
        ...get().imagesByPatientId,
        [patientId]: {
          clinicId,
          queryKey,
          requestId,
          filters,
          data: previous?.data ?? null,
          total: previous?.total ?? 0,
          loading: true,
          loadingMore: false,
          hasMore: previous?.hasMore ?? false,
          error: null,
          loadMoreError: null,
        },
      },
    });

    try {
      const page = await getPatientImagesPage({
        clinicId,
        patientId,
        ...filters,
        offset: 0,
        limit: PATIENT_IMAGES_PAGE_SIZE,
      });
      const latest = get().imagesByPatientId[patientId];

      if (latest?.queryKey !== queryKey || latest.requestId !== requestId) {
        return;
      }

      set({
        imagesByPatientId: {
          ...get().imagesByPatientId,
          [patientId]: {
            ...latest,
            data: page.images,
            total: page.total,
            loading: false,
            hasMore: page.hasMore,
            error: null,
          },
        },
      });
    } catch (cause) {
      const error = toError(cause);
      logger.captureException(error, {
        store: "patient-images-store",
        action: "fetchPatientImages",
        clinicId,
        patientId,
      });
      const latest = get().imagesByPatientId[patientId];

      if (latest?.queryKey !== queryKey || latest.requestId !== requestId) {
        return;
      }

      set({
        imagesByPatientId: {
          ...get().imagesByPatientId,
          [patientId]: {
            ...latest,
            loading: false,
            error,
          },
        },
      });
    }
  },

  loadMorePatientImages: async (patientId) => {
    const current = get().imagesByPatientId[patientId];

    if (
      !current ||
      current.data === null ||
      current.loading ||
      current.loadingMore ||
      !current.hasMore
    ) {
      return;
    }

    const { clinicId, queryKey, requestId, filters } = current;
    set({
      imagesByPatientId: {
        ...get().imagesByPatientId,
        [patientId]: {
          ...current,
          loadingMore: true,
          loadMoreError: null,
        },
      },
    });

    try {
      const page = await getPatientImagesPage({
        clinicId,
        patientId,
        ...filters,
        offset: current.data.length,
        limit: PATIENT_IMAGES_PAGE_SIZE,
      });
      const latest = get().imagesByPatientId[patientId];

      if (
        latest?.queryKey !== queryKey ||
        latest.requestId !== requestId ||
        latest.data === null
      ) {
        return;
      }

      const existingIds = new Set(latest.data.map((image) => image.id));
      const newImages = page.images.filter(
        (image) => !existingIds.has(image.id),
      );

      set({
        imagesByPatientId: {
          ...get().imagesByPatientId,
          [patientId]: {
            ...latest,
            data: [...latest.data, ...newImages],
            total: page.total,
            loadingMore: false,
            hasMore: page.hasMore,
            loadMoreError: null,
          },
        },
      });
    } catch (cause) {
      const error = toError(cause);
      logger.captureException(error, {
        store: "patient-images-store",
        action: "loadMorePatientImages",
        clinicId,
        patientId,
      });
      const latest = get().imagesByPatientId[patientId];

      if (latest?.queryKey !== queryKey || latest.requestId !== requestId) {
        return;
      }

      set({
        imagesByPatientId: {
          ...get().imagesByPatientId,
          [patientId]: {
            ...latest,
            loadingMore: false,
            loadMoreError: error,
          },
        },
      });
    }
  },

  refreshPatientImages: async (patientId) => {
    const current = get().imagesByPatientId[patientId];

    if (!current) {
      return;
    }

    await get().fetchPatientImages(patientId, current.filters, true);
  },

  uploadPatientImage: async ({ clinicId, patientId, file, metadata }) => {
    set({
      uploading: true,
      uploadProgress: 0,
      uploadCurrentFile: 1,
      uploadTotalFiles: 1,
      uploadError: null,
    });

    try {
      const capturedAt = resolveCapturedAt(metadata);
      const image = await uploadSinglePatientImage(
        { clinicId, patientId, file, metadata },
        capturedAt,
        (progress) => set({ uploadProgress: progress }),
      );

      await get().refreshPatientImages(patientId);
      set({
        uploading: false,
        uploadProgress: 100,
        uploadCurrentFile: 0,
        uploadTotalFiles: 0,
      });
      return image;
    } catch (cause) {
      const error = cause instanceof Error ? cause : new Error(String(cause));
      logger.captureException(error, {
        store: "patient-images-store",
        action: "uploadPatientImage",
        clinicId,
        patientId,
      });
      set({
        uploading: false,
        uploadCurrentFile: 0,
        uploadTotalFiles: 0,
        uploadError: error,
      });
      throw error;
    }
  },

  uploadPatientImages: async ({ clinicId, patientId, files, metadata }) => {
    const total = files.length;
    set({
      uploading: true,
      uploadProgress: 0,
      uploadCurrentFile: 1,
      uploadTotalFiles: total,
      uploadError: null,
    });

    try {
      const images: PatientImage[] = [];
      const capturedAt = resolveCapturedAt(metadata);

      for (let index = 0; index < files.length; index++) {
        const file = files[index];
        set({ uploadCurrentFile: index + 1 });

        const image = await uploadSinglePatientImage(
          { clinicId, patientId, file, metadata },
          capturedAt,
          (fileProgress) =>
            set({
              uploadProgress: ((index + fileProgress / 100) / total) * 100,
            }),
        );

        images.push(image);
      }

      await get().refreshPatientImages(patientId);
      set({
        uploading: false,
        uploadProgress: 100,
        uploadCurrentFile: 0,
        uploadTotalFiles: 0,
      });
      return images;
    } catch (cause) {
      const error = cause instanceof Error ? cause : new Error(String(cause));
      logger.captureException(error, {
        store: "patient-images-store",
        action: "uploadPatientImages",
        clinicId,
        patientId,
        fileCount: total,
      });
      set({
        uploading: false,
        uploadCurrentFile: 0,
        uploadTotalFiles: 0,
        uploadError: error,
      });
      throw error;
    }
  },

  deletePatientImage: async (patientId, image) => {
    set({ deletingId: image.id, deleteError: null });

    try {
      await deletePatientImageDal(image.id, image.storage_key);
      await get().refreshPatientImages(patientId);
      set({ deletingId: null });
    } catch (cause) {
      const error = cause instanceof Error ? cause : new Error(String(cause));
      logger.captureException(error, {
        store: "patient-images-store",
        action: "deletePatientImage",
        patientId,
        imageId: image.id,
      });
      set({ deletingId: null, deleteError: error });
      throw error;
    }
  },

  openDeleteConfirm: (image, onSuccess) =>
    set({ deleteConfirm: { image, onSuccess: onSuccess ?? null } }),

  closeDeleteConfirm: () => set({ deleteConfirm: null }),
}));
