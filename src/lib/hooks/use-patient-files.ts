import { useCallback, useEffect, useState } from "react";

import { getFileUrl } from "@/dal/patient-files.dal";
import { peekCachedPatientFileUrl } from "@/lib/patient-file-storage";
import { usePatientFilesStore } from "@/stores/patient-files-store";
import { isInitialLoading } from "@/stores/query-state";
import type { PatientFile, PatientFileUpdate } from "@/types/database.types";

export function usePatientFiles(patientId: string) {
  const entry = usePatientFilesStore(
    (state) => state.filesByPatientId[patientId],
  );
  const fetchPatientFiles = usePatientFilesStore(
    (state) => state.fetchPatientFiles,
  );

  useEffect(() => {
    if (!patientId.trim()) {
      return;
    }

    void fetchPatientFiles(patientId);
  }, [fetchPatientFiles, patientId]);

  return {
    data: entry?.data ?? undefined,
    isLoading: isInitialLoading(entry),
    error: entry?.error,
  };
}

export function useUploadPatientFiles() {
  const uploadPatientFiles = usePatientFilesStore(
    (state) => state.uploadPatientFiles,
  );
  const isPending = usePatientFilesStore((state) => state.uploading);
  const progress = usePatientFilesStore((state) => state.uploadProgress);
  const currentFile = usePatientFilesStore((state) => state.uploadCurrentFile);
  const totalFiles = usePatientFilesStore((state) => state.uploadTotalFiles);
  const error = usePatientFilesStore((state) => state.uploadError);

  const mutateAsync = useCallback(
    (input: Parameters<typeof uploadPatientFiles>[0]) =>
      uploadPatientFiles(input),
    [uploadPatientFiles],
  );

  return { mutateAsync, isPending, progress, currentFile, totalFiles, error };
}

export function useUpdatePatientFile() {
  const updatePatientFile = usePatientFilesStore(
    (state) => state.updatePatientFile,
  );
  const updatingId = usePatientFilesStore((state) => state.updatingId);
  const error = usePatientFilesStore((state) => state.updateError);

  const mutateAsync = useCallback(
    ({
      patientId,
      fileId,
      data,
    }: {
      patientId: string;
      fileId: string;
      data: PatientFileUpdate;
    }) => updatePatientFile(patientId, fileId, data),
    [updatePatientFile],
  );

  return {
    mutateAsync,
    isPending: updatingId !== null,
    updatingId,
    error,
  };
}

export function useDeletePatientFile() {
  const deletePatientFile = usePatientFilesStore(
    (state) => state.deletePatientFile,
  );
  const deletingId = usePatientFilesStore((state) => state.deletingId);
  const error = usePatientFilesStore((state) => state.deleteError);

  const mutateAsync = useCallback(
    ({ patientId, file }: { patientId: string; file: PatientFile }) =>
      deletePatientFile(patientId, file),
    [deletePatientFile],
  );

  return {
    mutateAsync,
    isPending: deletingId !== null,
    deletingId,
    error,
  };
}

export function usePatientFileUrl(file: PatientFile | null) {
  const cachedUrl = file ? peekCachedPatientFileUrl(file.storage_key) : null;
  const [asyncUrl, setAsyncUrl] = useState<{
    key: string;
    url: string | null;
  } | null>(null);

  useEffect(() => {
    if (!file) {
      return;
    }

    if (peekCachedPatientFileUrl(file.storage_key)) {
      return;
    }

    let cancelled = false;

    getFileUrl(file)
      .then((resolvedUrl) => {
        if (!cancelled) {
          setAsyncUrl({ key: file.storage_key, url: resolvedUrl });
        }
      })
      .catch(() => {
        if (!cancelled) {
          setAsyncUrl({ key: file.storage_key, url: null });
        }
      });

    return () => {
      cancelled = true;
    };
  }, [file]);

  if (!file) {
    return null;
  }

  if (cachedUrl) {
    return cachedUrl;
  }

  if (asyncUrl?.key === file.storage_key) {
    return asyncUrl.url;
  }

  return null;
}
