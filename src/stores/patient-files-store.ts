import { create } from "zustand";

import {
  createPatientFile,
  deletePatientFileRecord,
  getGlobalPatientFiles,
  getPatientFiles,
  updatePatientFile as updatePatientFileDal,
  type GlobalPatientFilesParams,
  type PaginatedPatientFiles,
} from "@/dal/patient-files.dal";
import { getPatient } from "@/dal/patients.dal";
import { getActiveClinicId } from "@/lib/active-clinic-id";
import { logger } from "@/lib/logger";
import {
  buildPatientFileKey,
  removePatientFileObject,
  uploadPatientFileObject,
  validatePatientFile,
} from "@/lib/patient-file-storage";
import type { PatientFileUploadInput } from "@/lib/schemas/patient-file-schema";
import { useAuthStore } from "@/stores/auth-store";
import {
  errorQueryEntry,
  loadingQueryEntry,
  successQueryEntry,
  type QueryEntry,
} from "@/stores/query-state";
import type { PatientFile, PatientFileUpdate } from "@/types/database.types";

type PatientFileDeleteConfirmState = {
  file: PatientFile;
  onSuccess: (() => void) | null;
};

type UploadPatientFileInput = {
  clinicId: string;
  patientId: string;
  file: File;
  metadata: PatientFileUploadInput;
};

type UploadPatientFilesInput = {
  clinicId: string;
  patientId: string;
  files: File[];
  metadata: PatientFileUploadInput;
};

type PatientFilesStore = {
  filesByPatientId: Record<string, QueryEntry<PatientFile[]>>;
  globalFilesByQuery: Record<string, QueryEntry<PaginatedPatientFiles>>;
  uploading: boolean;
  uploadProgress: number;
  uploadCurrentFile: number;
  uploadTotalFiles: number;
  uploadError: Error | null;
  updatingId: string | null;
  updateError: Error | null;
  deletingId: string | null;
  deleteError: Error | null;
  deleteConfirm: PatientFileDeleteConfirmState | null;
  fetchPatientFiles: (patientId: string) => Promise<void>;
  fetchGlobalPatientFiles: (
    params: Omit<GlobalPatientFilesParams, "clinicId">,
  ) => Promise<void>;
  uploadPatientFile: (input: UploadPatientFileInput) => Promise<PatientFile>;
  uploadPatientFiles: (
    input: UploadPatientFilesInput,
  ) => Promise<PatientFile[]>;
  updatePatientFile: (
    patientId: string,
    fileId: string,
    data: PatientFileUpdate,
  ) => Promise<PatientFile>;
  deletePatientFile: (patientId: string, file: PatientFile) => Promise<void>;
  openDeleteConfirm: (file: PatientFile, onSuccess?: () => void) => void;
  closeDeleteConfirm: () => void;
};

export function globalPatientFilesKey(
  clinicId: string,
  params: Omit<GlobalPatientFilesParams, "clinicId">,
) {
  return JSON.stringify({ clinicId, ...params });
}

async function assertPatientBelongsToClinic(
  patientId: string,
  clinicId: string,
) {
  const patient = await getPatient(patientId);

  if (patient.clinic_id !== clinicId) {
    throw new Error("El paciente no pertenece a la clínica activa.");
  }
}

async function uploadSinglePatientFile(
  { clinicId, patientId, file, metadata }: UploadPatientFileInput,
  onProgress: (progress: number) => void,
): Promise<PatientFile> {
  await assertPatientBelongsToClinic(patientId, clinicId);

  const validated = validatePatientFile(file);
  const fileId = crypto.randomUUID();
  const storageKey = buildPatientFileKey(
    clinicId,
    patientId,
    fileId,
    validated.sanitizedFilename,
  );

  await uploadPatientFileObject(
    storageKey,
    file,
    validated.mimeType,
    onProgress,
  );

  const createdBy = useAuthStore.getState().session?.user.id ?? null;

  try {
    return await createPatientFile({
      patient_id: patientId,
      clinic_id: clinicId,
      storage_key: storageKey,
      original_filename: validated.sanitizedFilename,
      mime_type: validated.mimeType,
      file_size_bytes: file.size,
      category: metadata.category,
      notes: metadata.notes,
      created_by: createdBy,
    });
  } catch (cause) {
    try {
      await removePatientFileObject(storageKey);
    } catch (rollbackCause) {
      logger.captureException(rollbackCause, {
        store: "patient-files-store",
        action: "uploadPatientFile.rollback",
        storageKey,
      });
    }

    logger.captureException(cause, {
      store: "patient-files-store",
      action: "uploadPatientFile.insert",
      storageKey,
      patientId,
      clinicId,
    });

    throw cause;
  }
}

export const usePatientFilesStore = create<PatientFilesStore>((set, get) => ({
  filesByPatientId: {},
  globalFilesByQuery: {},
  uploading: false,
  uploadProgress: 0,
  uploadCurrentFile: 0,
  uploadTotalFiles: 0,
  uploadError: null,
  updatingId: null,
  updateError: null,
  deletingId: null,
  deleteError: null,
  deleteConfirm: null,

  fetchPatientFiles: async (patientId) => {
    const previous = get().filesByPatientId[patientId];

    set({
      filesByPatientId: {
        ...get().filesByPatientId,
        [patientId]: loadingQueryEntry(previous),
      },
    });

    try {
      const files = await getPatientFiles(patientId);
      set({
        filesByPatientId: {
          ...get().filesByPatientId,
          [patientId]: successQueryEntry(files),
        },
      });
    } catch (cause) {
      logger.captureException(cause, {
        store: "patient-files-store",
        action: "fetchPatientFiles",
        patientId,
      });
      set({
        filesByPatientId: {
          ...get().filesByPatientId,
          [patientId]: errorQueryEntry(
            cause instanceof Error ? cause : new Error(String(cause)),
            previous,
          ),
        },
      });
    }
  },

  fetchGlobalPatientFiles: async (params) => {
    const clinicId = getActiveClinicId();

    if (!clinicId) {
      return;
    }

    const key = globalPatientFilesKey(clinicId, params);
    const previous = get().globalFilesByQuery[key];

    set({
      globalFilesByQuery: {
        ...get().globalFilesByQuery,
        [key]: loadingQueryEntry(previous),
      },
    });

    try {
      const page = await getGlobalPatientFiles({ clinicId, ...params });
      set({
        globalFilesByQuery: {
          ...get().globalFilesByQuery,
          [key]: successQueryEntry(page),
        },
      });
    } catch (cause) {
      const error = cause instanceof Error ? cause : new Error(String(cause));
      logger.captureException(error, {
        store: "patient-files-store",
        action: "fetchGlobalPatientFiles",
        clinicId,
        page: params.page,
      });
      set({
        globalFilesByQuery: {
          ...get().globalFilesByQuery,
          [key]: errorQueryEntry(error, previous),
        },
      });
    }
  },

  uploadPatientFile: async ({ clinicId, patientId, file, metadata }) => {
    set({
      uploading: true,
      uploadProgress: 0,
      uploadCurrentFile: 1,
      uploadTotalFiles: 1,
      uploadError: null,
    });

    try {
      const uploaded = await uploadSinglePatientFile(
        { clinicId, patientId, file, metadata },
        (progress) => set({ uploadProgress: progress }),
      );

      await get().fetchPatientFiles(patientId);
      set({
        uploading: false,
        uploadProgress: 100,
        uploadCurrentFile: 0,
        uploadTotalFiles: 0,
      });

      return uploaded;
    } catch (cause) {
      const error = cause instanceof Error ? cause : new Error(String(cause));
      logger.captureException(error, {
        store: "patient-files-store",
        action: "uploadPatientFile",
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

  uploadPatientFiles: async ({ clinicId, patientId, files, metadata }) => {
    const total = files.length;
    set({
      uploading: true,
      uploadProgress: 0,
      uploadCurrentFile: 1,
      uploadTotalFiles: total,
      uploadError: null,
    });

    try {
      const uploadedFiles: PatientFile[] = [];

      for (let index = 0; index < files.length; index++) {
        const file = files[index];
        set({ uploadCurrentFile: index + 1 });

        const uploaded = await uploadSinglePatientFile(
          { clinicId, patientId, file, metadata },
          (fileProgress) =>
            set({
              uploadProgress: ((index + fileProgress / 100) / total) * 100,
            }),
        );

        uploadedFiles.push(uploaded);
      }

      await get().fetchPatientFiles(patientId);
      set({
        uploading: false,
        uploadProgress: 100,
        uploadCurrentFile: 0,
        uploadTotalFiles: 0,
      });

      return uploadedFiles;
    } catch (cause) {
      const error = cause instanceof Error ? cause : new Error(String(cause));
      logger.captureException(error, {
        store: "patient-files-store",
        action: "uploadPatientFiles",
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

  updatePatientFile: async (patientId, fileId, data) => {
    set({ updatingId: fileId, updateError: null });

    try {
      const updated = await updatePatientFileDal(fileId, data);
      await get().fetchPatientFiles(patientId);
      const globalFilesByQuery = Object.fromEntries(
        Object.entries(get().globalFilesByQuery).map(([key, entry]) => [
          key,
          entry.data
            ? successQueryEntry({
                ...entry.data,
                files: entry.data.files.map((file) =>
                  file.id === fileId ? { ...file, ...updated } : file,
                ),
              })
            : entry,
        ]),
      );
      set({ updatingId: null, globalFilesByQuery });
      return updated;
    } catch (cause) {
      const error = cause instanceof Error ? cause : new Error(String(cause));
      logger.captureException(error, {
        store: "patient-files-store",
        action: "updatePatientFile",
        patientId,
        fileId,
      });
      set({ updatingId: null, updateError: error });
      throw error;
    }
  },

  deletePatientFile: async (patientId, file) => {
    set({ deletingId: file.id, deleteError: null });

    try {
      await removePatientFileObject(file.storage_key);
    } catch (cause) {
      logger.captureException(cause, {
        store: "patient-files-store",
        action: "deletePatientFile.storage",
        patientId,
        fileId: file.id,
        storageKey: file.storage_key,
      });
      const error = cause instanceof Error ? cause : new Error(String(cause));
      set({ deletingId: null, deleteError: error });
      throw error;
    }

    try {
      await deletePatientFileRecord(file.id);
    } catch (cause) {
      logger.captureException(cause, {
        store: "patient-files-store",
        action: "deletePatientFile.database",
        patientId,
        fileId: file.id,
        storageKey: file.storage_key,
      });
      const error = cause instanceof Error ? cause : new Error(String(cause));
      set({ deletingId: null, deleteError: error });
      throw error;
    }

    await get().fetchPatientFiles(patientId);
    const globalFilesByQuery = Object.fromEntries(
      Object.entries(get().globalFilesByQuery).map(([key, entry]) => {
        if (!entry.data) {
          return [key, entry];
        }

        const includesFile = entry.data.files.some(
          (candidate) => candidate.id === file.id,
        );

        if (!includesFile) {
          return [key, entry];
        }

        return [
          key,
          successQueryEntry({
            files: entry.data.files.filter(
              (candidate) => candidate.id !== file.id,
            ),
            total: Math.max(0, entry.data.total - 1),
          }),
        ];
      }),
    );
    set({ deletingId: null, globalFilesByQuery });
  },

  openDeleteConfirm: (file, onSuccess) =>
    set({ deleteConfirm: { file, onSuccess: onSuccess ?? null } }),

  closeDeleteConfirm: () => set({ deleteConfirm: null }),
}));
