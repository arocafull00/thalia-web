"use client";

import { FileSearch } from "lucide-react";

import FilesPagination from "@/components/files/components/files-pagination";
import FilesTable from "@/components/files/components/files-table";
import { Notice } from "@/components/ui/primitives/notice";
import { SkeletonList } from "@/components/ui/primitives/skeleton-list";
import { FILES_COPY } from "@/copy/files-copy";
import type { PatientFileWithPatient } from "@/types/database.types";

type FileAction = (file: PatientFileWithPatient) => void;

type FilesResultsProps = {
  files: PatientFileWithPatient[];
  total: number;
  page: number;
  totalPages: number;
  hasActiveFilters: boolean;
  isLoading: boolean;
  isRefreshing: boolean;
  error: Error | null;
  onView: FileAction;
  onDownload: FileAction;
  onDelete: FileAction;
  onPageChange: (page: number) => void;
};

export default function FilesResults({
  files,
  total,
  page,
  totalPages,
  hasActiveFilters,
  isLoading,
  isRefreshing,
  error,
  onView,
  onDownload,
  onDelete,
  onPageChange,
}: FilesResultsProps) {
  const showEmpty = !isLoading && !error && files.length === 0;

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-semibold text-ink">
            {FILES_COPY.page.results(total)}
          </h2>
          <p className="mt-0.5 text-sm text-ink-muted">
            {FILES_COPY.page.description}
          </p>
        </div>
      </div>

      {isLoading ? <SkeletonList /> : null}
      {error ? (
        <Notice tone="danger" message={FILES_COPY.page.loadError} />
      ) : null}
      {showEmpty ? (
        <div className="flex flex-col items-center px-6 py-16 text-center">
          <span className="mb-4 flex size-12 items-center justify-center rounded-2xl bg-primary-subtle text-primary">
            <FileSearch aria-hidden="true" />
          </span>
          <p className="font-medium text-ink">
            {hasActiveFilters
              ? FILES_COPY.page.emptyFiltered
              : FILES_COPY.page.empty}
          </p>
          {!hasActiveFilters ? (
            <p className="mt-1 max-w-md text-sm text-ink-secondary">
              {FILES_COPY.page.emptyHint}
            </p>
          ) : null}
        </div>
      ) : null}
      {!isLoading && files.length > 0 ? (
        <FilesTable
          files={files}
          onView={onView}
          onDownload={onDownload}
          onDelete={onDelete}
        />
      ) : null}
      {!isLoading ? (
        <FilesPagination
          page={page}
          total={total}
          totalPages={totalPages}
          disabled={isRefreshing}
          onPageChange={onPageChange}
        />
      ) : null}
    </div>
  );
}
