"use client";

import { Download, Eye, MoreHorizontal, Pencil, Trash2 } from "lucide-react";

import PatientFileIcon from "@/components/patients/components/files/patient-file-icon";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  getPatientFileCategoryLabel,
  PATIENT_FILES_COPY,
} from "@/copy/patient-files-copy";
import { formatDate } from "@/lib/format";
import { isPatientFileViewable } from "@/lib/patient-file-storage";
import type { PatientFile } from "@/types/database.types";

function formatFileSize(bytes: number) {
  if (bytes < 1024) {
    return `${bytes} B`;
  }

  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  }

  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

type PatientFileRowProps = {
  file: PatientFile;
  onView: (file: PatientFile) => void;
  onDownload: (file: PatientFile) => void;
  onEdit: (file: PatientFile) => void;
  onDelete: (file: PatientFile) => void;
};

export default function PatientFileRow({
  file,
  onView,
  onDownload,
  onEdit,
  onDelete,
}: PatientFileRowProps) {
  const viewable = isPatientFileViewable(file.mime_type);

  return (
    <div className="flex items-center gap-4 border-b border-border-subtle py-4 last:border-b-0">
      <PatientFileIcon mimeType={file.mime_type} />

      <button
        type="button"
        onClick={() => (viewable ? onView(file) : onDownload(file))}
        className="min-w-0 flex-1 text-left"
      >
        <p className="truncate text-sm font-medium text-ink">
          {file.original_filename}
        </p>
        <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-ink-secondary">
          <span>{getPatientFileCategoryLabel(file.category)}</span>
          <span>{formatFileSize(file.file_size_bytes)}</span>
          <span>{formatDate(file.created_at)}</span>
        </div>
        {file.notes ? (
          <p className="mt-1 line-clamp-1 text-xs text-ink-muted">
            {file.notes}
          </p>
        ) : null}
      </button>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label={PATIENT_FILES_COPY.actions.rowMenu}
          >
            <MoreHorizontal size={18} strokeWidth={1.5} />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {viewable ? (
            <DropdownMenuItem onClick={() => onView(file)}>
              <Eye aria-hidden="true" />
              {PATIENT_FILES_COPY.actions.view}
            </DropdownMenuItem>
          ) : null}
          <DropdownMenuItem onClick={() => onDownload(file)}>
            <Download aria-hidden="true" />
            {PATIENT_FILES_COPY.actions.download}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onEdit(file)}>
            <Pencil aria-hidden="true" />
            {PATIENT_FILES_COPY.actions.edit}
          </DropdownMenuItem>
          <DropdownMenuItem
            variant="destructive"
            onClick={() => onDelete(file)}
          >
            <Trash2 aria-hidden="true" />
            {PATIENT_FILES_COPY.actions.delete}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
