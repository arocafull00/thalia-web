import { create } from "zustand";

import {
  createPatientImage,
  deletePatientImage as deletePatientImageDal,
  getPatientImages,
} from "@/dal/patient-images.dal";
import {
  compressTreatmentImage,
  getImageDimensions,
} from "@/lib/image-compression";
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

type PatientImagesStore = {
  imagesByPatientId: Record<string, QueryEntry<PatientImage[]>>;
  uploading: boolean;
  uploadProgress: number;
  uploadError: Error | null;
  deletingId: string | null;
  deleteError: Error | null;
  deleteConfirm: PatientImageDeleteConfirmState | null;
  fetchPatientImages: (patientId: string) => Promise<void>;
  uploadPatientImage: (input: UploadPatientImageInput) => Promise<PatientImage>;
  deletePatientImage: (patientId: string, image: PatientImage) => Promise<void>;
  openDeleteConfirm: (image: PatientImage, onSuccess?: () => void) => void;
  closeDeleteConfirm: () => void;
};

export const usePatientImagesStore = create<PatientImagesStore>((set, get) => ({
  imagesByPatientId: {},
  uploading: false,
  uploadProgress: 0,
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
    set({ uploading: true, uploadProgress: 0, uploadError: null });

    try {
      const compressedFile = await compressTreatmentImage(file);
      const { width, height } = await getImageDimensions(compressedFile);
      const imageId = crypto.randomUUID();
      const storageKey = buildPatientImageKey(
        clinicId,
        patientId,
        imageId,
        "webp",
      );

      await uploadPatientImageObject(
        storageKey,
        compressedFile,
        "image/webp",
        (progress) => set({ uploadProgress: progress }),
      );

      const capturedAt = metadata.captured_at
        ? new Date(`${metadata.captured_at}T12:00:00`).toISOString()
        : new Date().toISOString();

      const image = await createPatientImage({
        patient_id: patientId,
        clinic_id: clinicId,
        storage_key: storageKey,
        original_filename: file.name,
        mime_type: "image/webp",
        file_size_bytes: compressedFile.size,
        width,
        height,
        category: metadata.category,
        phase: metadata.phase,
        treatment_id: metadata.treatment_id,
        notes: metadata.notes,
        captured_at: capturedAt,
      });

      await get().fetchPatientImages(patientId);
      set({ uploading: false, uploadProgress: 100 });
      return image;
    } catch (cause) {
      const error = cause instanceof Error ? cause : new Error(String(cause));
      set({ uploading: false, uploadError: error });
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
      set({ deletingId: null, deleteError: error });
      throw error;
    }
  },

  openDeleteConfirm: (image, onSuccess) =>
    set({ deleteConfirm: { image, onSuccess: onSuccess ?? null } }),

  closeDeleteConfirm: () => set({ deleteConfirm: null }),
}));
