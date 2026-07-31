"use client";

import { Download, Trash2 } from "lucide-react";
import { useMemo } from "react";

import { buildFilesColumns } from "@/components/files/components/files-columns";
import { DataTable } from "@/components/ui/data-table";
import { FILES_COPY } from "@/copy/files-copy";
import {
  getPatientFileCategoryLabel,
  PATIENT_FILES_COPY,
} from "@/copy/patient-files-copy";
import { formatDate, formatFileSize } from "@/lib/format";
import type { PatientFileWithPatient } from "@/types/database.types";

type FileAction = (file: PatientFileWithPatient) => void;

type FilesTableProps = {
  files: PatientFileWithPatient[];
  onView: FileAction;
  onDownload: FileAction;
  onDelete: FileAction;
};

export default function FilesTable({
  files,
  onView,
  onDownload,
  onDelete,
}: FilesTableProps) {
  const columns = useMemo(
    () => buildFilesColumns(onView, onDownload, onDelete),
    [onDelete, onDownload, onView],
  );
  const mobileColumns = useMemo(
    () => [
      {
        key: "filename",
        label: FILES_COPY.table.file,
        priority: "primary" as const,
        render: (file: PatientFileWithPatient) => (
          <span className="block truncate font-medium">
            {file.original_filename}
          </span>
        ),
      },
      {
        key: "patient",
        label: FILES_COPY.table.patient,
        priority: "primary" as const,
        render: (file: PatientFileWithPatient) => (
          <span className="text-ink-secondary">
            {file.patients?.full_name ?? "Paciente"}
          </span>
        ),
      },
      {
        key: "category",
        label: FILES_COPY.table.category,
        priority: "secondary" as const,
        render: (file: PatientFileWithPatient) =>
          getPatientFileCategoryLabel(file.category),
      },
      {
        key: "date",
        label: FILES_COPY.table.date,
        priority: "secondary" as const,
        render: (file: PatientFileWithPatient) => formatDate(file.created_at),
      },
      {
        key: "size",
        label: FILES_COPY.table.size,
        priority: "secondary" as const,
        render: (file: PatientFileWithPatient) =>
          formatFileSize(file.file_size_bytes),
      },
    ],
    [],
  );
  const mobileActions = useMemo(
    () => [
      {
        icon: <Download aria-hidden="true" />,
        label: PATIENT_FILES_COPY.actions.download,
        onClick: onDownload,
      },
      {
        icon: <Trash2 aria-hidden="true" />,
        label: PATIENT_FILES_COPY.actions.delete,
        onClick: onDelete,
      },
    ],
    [onDelete, onDownload],
  );

  return (
    <DataTable
      columns={columns}
      data={files}
      mobileColumns={mobileColumns}
      mobileActions={mobileActions}
      onRowClick={onView}
      getMobileRowKey={(file) => file.id}
    />
  );
}
