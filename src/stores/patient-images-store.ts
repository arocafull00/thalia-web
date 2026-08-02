import { fromZonedTime } from "date-fns-tz";
import { create } from "zustand";

import {
  createPatientImage,
  deletePatientImage as deletePatientImageDal,
  getPatientImages,
} from "@/dal/patient-images.dal";
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
import {
  errorQueryEntry,
  loadingQueryEntry,
  successQueryEntry,
  type QueryEntry,
} from "@/stores/query-state";
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

type PatientImagesStore = {
  imagesByPatientId: Record<string, QueryEntry<PatientImage[]>>;
  uploading: boolean;
  uploadProgress: number;
  uploadCurrentFile: number;
  uploadTotalFiles: number;
  uploadError: Error | null;
  deletingId: string | null;
  deleteError: Error | null;
  deleteConfirm: PatientImageDeleteConfirmState | null;
  fetchPatientImages: (patientId: string) => Promise<void>;
  uploadPatientImage: (input: UploadPatientImageInput) => Promise<PatientImage>;
  uploadPatientImages: (
    input: UploadPatientImagesInput,
  ) => Promise<PatientImage[]>;
  deletePatientImage: (patientId: string, image: PatientImage) => Promise<void>;
  openDeleteConfirm: (image: PatientImage, onSuccess?: () => void) => void;
  closeDeleteConfirm: () => void;
};

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

  fetchPatientImages: async (patientId) => {
    const previous = get().imagesByPatientId[patientId];
    set({
      imagesByPatientId: {
        ...get().imagesByPatientId,
        [patientId]: loadingQueryEntry(previous),
      },
    });

    try {
      const images = await getPatientImages(patientId);
      set({
        imagesByPatientId: {
          ...get().imagesByPatientId,
          [patientId]: successQueryEntry(images),
        },
      });
    } catch (cause) {
      logger.captureException(cause, {
        store: "patient-images-store",
        action: "fetchPatientImages",
        patientId,
      });
      set({
        imagesByPatientId: {
          ...get().imagesByPatientId,
          [patientId]: errorQueryEntry(
            cause instanceof Error ? cause : new Error(String(cause)),
            previous,
          ),
        },
      });
    }
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

      await get().fetchPatientImages(patientId);
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

      await get().fetchPatientImages(patientId);
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
      await get().fetchPatientImages(patientId);
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
