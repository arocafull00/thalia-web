"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import { PATIENT_FILES_COPY } from "@/copy/patient-files-copy";
import type {
  GlobalPatientFilesParams,
  PaginatedPatientFiles,
} from "@/dal/patient-files.dal";
import { getFileUrl } from "@/dal/patient-files.dal";
import {
  buildFilesQueryFromSearchParams,
  FILES_PAGE_SIZE,
} from "@/lib/files-page-query";
import { useFilterSearch } from "@/lib/hooks/use-filter-search";
import { useGlobalPatientFiles } from "@/lib/hooks/use-global-patient-files";
import { useUrlFilters } from "@/lib/hooks/use-url-filters";
import { isPatientFileViewable } from "@/lib/patient-file-storage";
import { usePatientFilesStore } from "@/stores/patient-files-store";
import type {
  PatientFile,
  PatientFileCategory,
  PatientFileWithPatient,
} from "@/types/database.types";

export { buildFilesQueryFromSearchParams, FILES_PAGE_SIZE };

export const FILES_FILTER_DEFAULTS = {
  category: "",
  from: "",
  page: "1",
  q: "",
  sort: "newest",
  to: "",
};

export type FilesFilters = Pick<
  typeof FILES_FILTER_DEFAULTS,
  "category" | "from" | "sort" | "to"
>;

type FilesPageSeed = {
  initialPage?: PaginatedPatientFiles;
  initialQuery?: Omit<GlobalPatientFilesParams, "clinicId">;
};

export function useFilesPage(seed?: FilesPageSeed) {
  const [viewerFile, setViewerFile] = useState<PatientFileWithPatient | null>(
    null,
  );
  const [viewerOpen, setViewerOpen] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [sheetKey, setSheetKey] = useState(0);
  const { filters, setFilters } = useUrlFilters(FILES_FILTER_DEFAULTS);
  const setSearchFilter = useCallback(
    (_key: "q", value: string) => setFilters({ page: "1", q: value }),
    [setFilters],
  );
  const { searchQuery, handleSearchChange } = useFilterSearch(
    filters.q,
    setSearchFilter,
  );
  const queryParams = useMemo(
    () => buildFilesQueryFromSearchParams(filters),
    [filters],
  );
  const page = queryParams.page;
  const filesQuery = useGlobalPatientFiles(queryParams, seed);
  const refreshFiles = filesQuery.refresh;
  const deleteConfirm = usePatientFilesStore((state) => state.deleteConfirm);
  const openDeleteConfirm = usePatientFilesStore(
    (state) => state.openDeleteConfirm,
  );
  const closeDeleteConfirm = usePatientFilesStore(
    (state) => state.closeDeleteConfirm,
  );
  const total = filesQuery.data?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / FILES_PAGE_SIZE));
  const hasActiveFilters = Boolean(
    searchQuery.trim() || filters.category || filters.from || filters.to,
  );

  useEffect(() => {
    if (!filesQuery.data || filesQuery.isLoading || page <= totalPages) {
      return;
    }

    setFilters({ page: String(totalPages) });
  }, [filesQuery.data, filesQuery.isLoading, page, setFilters, totalPages]);

  const updateFilters = useCallback(
    (updates: Partial<typeof FILES_FILTER_DEFAULTS>) => {
      setFilters({ ...updates, page: "1" });
    },
    [setFilters],
  );

  const handleFromChange = useCallback(
    (value: string) => {
      updateFilters({
        from: value,
        to: filters.to && value > filters.to ? value : filters.to,
      });
    },
    [filters.to, updateFilters],
  );

  const handleToChange = useCallback(
    (value: string) => {
      updateFilters({
        from: filters.from && value < filters.from ? value : filters.from,
        to: value,
      });
    },
    [filters.from, updateFilters],
  );

  const handleDownload = useCallback(async (file: PatientFile) => {
    try {
      const signedUrl = await getFileUrl(file);
      const downloadUrl = new URL(signedUrl);
      downloadUrl.searchParams.set("download", file.original_filename);
      const anchor = document.createElement("a");
      anchor.href = downloadUrl.toString();
      anchor.rel = "noopener";
      anchor.click();
    } catch {
      toast.error(PATIENT_FILES_COPY.errors.signedUrl);
    }
  }, []);

  const handleView = useCallback(
    (file: PatientFileWithPatient) => {
      if (!isPatientFileViewable(file.mime_type)) {
        void handleDownload(file);
        return;
      }

      setViewerFile(file);
      setViewerOpen(true);
    },
    [handleDownload],
  );

  const handleDelete = useCallback(
    (file: PatientFileWithPatient) => {
      openDeleteConfirm(file, () => void refreshFiles());
    },
    [openDeleteConfirm, refreshFiles],
  );

  const handleOpenSheet = useCallback(() => {
    setSheetKey((value) => value + 1);
    setSheetOpen(true);
  }, []);

  return {
    closeDeleteConfirm,
    deleteConfirm,
    files: filesQuery.data?.files ?? [],
    filesQuery,
    filters,
    handleDelete,
    handleDownload,
    handleFromChange,
    handleOpenSheet,
    handleSearchChange,
    handleToChange,
    handleView,
    hasActiveFilters,
    page,
    resetFilters: () => setFilters(FILES_FILTER_DEFAULTS),
    searchQuery,
    setCategory: (value: string) => updateFilters({ category: value }),
    setFilters: (updates: FilesFilters) => updateFilters(updates),
    setPage: (value: number) => setFilters({ page: String(value) }),
    setSheetOpen,
    setSort: (value: string) => updateFilters({ sort: value }),
    setViewerOpen,
    sheetKey,
    sheetOpen,
    total,
    totalPages,
    viewerFile,
    viewerOpen,
  };
}
