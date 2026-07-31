import { endOfDay, startOfDay } from "date-fns";
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";

import {
  PATIENT_FILE_CATEGORY_OPTIONS,
  PATIENT_FILES_COPY,
} from "@/copy/patient-files-copy";
import type { PatientFilesSort } from "@/dal/patient-files.dal";
import { getFileUrl } from "@/dal/patient-files.dal";
import {
  formatLocalDateInputValue,
  parseLocalDateInputValue,
} from "@/lib/date-input";
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

export const FILES_PAGE_SIZE = 20;

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

const sortValues: PatientFilesSort[] = [
  "newest",
  "oldest",
  "name_asc",
  "name_desc",
];

function parsePage(value: string) {
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 1;
}

function parseCategory(value: string): PatientFileCategory | null {
  return PATIENT_FILE_CATEGORY_OPTIONS.some((option) => option.value === value)
    ? (value as PatientFileCategory)
    : null;
}

function parseSort(value: string): PatientFilesSort {
  return sortValues.includes(value as PatientFilesSort)
    ? (value as PatientFilesSort)
    : "newest";
}

function parseDate(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return null;
  }

  const parsed = parseLocalDateInputValue(value);

  if (
    Number.isNaN(parsed.getTime()) ||
    formatLocalDateInputValue(parsed) !== value
  ) {
    return null;
  }

  return parsed;
}

function toStartIso(value: string) {
  const date = parseDate(value);
  return date ? startOfDay(date).toISOString() : null;
}

function toEndIso(value: string) {
  const date = parseDate(value);
  return date ? endOfDay(date).toISOString() : null;
}

export function useFilesPage() {
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
  const page = parsePage(filters.page);
  const queryParams = useMemo(
    () => ({
      category: parseCategory(filters.category),
      createdFrom: toStartIso(filters.from),
      createdTo: toEndIso(filters.to),
      page,
      pageSize: FILES_PAGE_SIZE,
      patientSearch: filters.q,
      sort: parseSort(filters.sort),
    }),
    [filters.category, filters.from, filters.q, filters.sort, filters.to, page],
  );
  const filesQuery = useGlobalPatientFiles(queryParams);
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
