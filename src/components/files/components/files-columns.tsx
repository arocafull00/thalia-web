"use client";

import type { ColumnDef } from "@tanstack/react-table";

import FileActionsMenu from "@/components/files/components/file-actions-menu";
import PatientFileIcon from "@/components/patients/components/files/patient-file-icon";
import { Badge } from "@/components/ui/badge";
import { FILES_COPY } from "@/copy/files-copy";
import { getPatientFileCategoryLabel } from "@/copy/patient-files-copy";
import { formatDate, formatFileSize } from "@/lib/format";
import type { PatientFileWithPatient } from "@/types/database.types";

type FileAction = (file: PatientFileWithPatient) => void;

export function buildFilesColumns(
  onView: FileAction,
  onDownload: FileAction,
  onDelete: FileAction,
): ColumnDef<PatientFileWithPatient>[] {
  return [
    {
      id: "file",
      header: FILES_COPY.table.file,
      cell: ({ row }) => (
        <div className="flex min-w-56 items-center gap-3">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary-subtle">
            <PatientFileIcon mimeType={row.original.mime_type} />
          </span>
          <div className="min-w-0">
            <p className="max-w-72 truncate font-medium text-ink">
              {row.original.original_filename}
            </p>
            <p className="mt-0.5 truncate text-xs text-ink-muted">
              {row.original.mime_type}
            </p>
          </div>
        </div>
      ),
    },
    {
      id: "patient",
      header: FILES_COPY.table.patient,
      cell: ({ row }) => (
        <span className="font-medium text-ink">
          {row.original.patients?.full_name ?? "Paciente"}
        </span>
      ),
    },
    {
      id: "category",
      header: FILES_COPY.table.category,
      cell: ({ row }) => (
        <Badge variant="muted">
          {getPatientFileCategoryLabel(row.original.category)}
        </Badge>
      ),
    },
    {
      id: "date",
      header: FILES_COPY.table.date,
      cell: ({ row }) => (
        <span className="text-ink-secondary">
          {formatDate(row.original.created_at)}
        </span>
      ),
    },
    {
      id: "size",
      header: FILES_COPY.table.size,
      cell: ({ row }) => (
        <span className="tabular-nums text-ink-secondary">
          {formatFileSize(row.original.file_size_bytes)}
        </span>
      ),
    },
    {
      id: "actions",
      header: () => <span className="sr-only">{FILES_COPY.table.actions}</span>,
      cell: ({ row }) => (
        <FileActionsMenu
          file={row.original}
          onView={onView}
          onDownload={onDownload}
          onDelete={onDelete}
        />
      ),
    },
  ];
}
