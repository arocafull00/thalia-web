"use client";

import { FileText } from "lucide-react";

import type { FileStatus } from "@/components/ui/dropzone";

type PatientFileUploaderDropzoneFileItemProps = {
  file: FileStatus<string, string>;
};

export default function PatientFileUploaderDropzoneFileItem({
  file,
}: PatientFileUploaderDropzoneFileItemProps) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-border bg-surface px-4 py-3">
      <FileText className="size-5 shrink-0 text-ink-muted" aria-hidden="true" />
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-ink">{file.fileName}</p>
        <p className="text-xs text-ink-secondary">
          {(file.file.size / (1024 * 1024)).toFixed(1)} MB
        </p>
      </div>
    </div>
  );
}
