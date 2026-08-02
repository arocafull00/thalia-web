"use client";

import { ImageIcon, Trash2 } from "lucide-react";

import {
  DropzoneFileListItem,
  DropzoneRemoveFile,
  type FileStatus,
} from "@/components/ui/dropzone";

type PatientImageUploaderDropzoneFileItemProps = {
  file: FileStatus<string, string>;
  showPreview: boolean;
};

export default function PatientImageUploaderDropzoneFileItem({
  file,
  showPreview,
}: PatientImageUploaderDropzoneFileItemProps) {
  return (
    <DropzoneFileListItem
      className="overflow-hidden rounded-xl border border-border bg-canvas p-0 shadow-none"
      file={file}
    >
      {file.status === "pending" ? (
        <div className="aspect-square animate-pulse bg-border/40" />
      ) : null}
      {file.status === "success" && showPreview ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={file.result}
          alt={file.fileName}
          loading="lazy"
          decoding="async"
          className="aspect-square w-full object-cover"
        />
      ) : null}
      {file.status === "success" && !showPreview ? (
        <div className="flex aspect-square items-center justify-center bg-primary-subtle">
          <ImageIcon className="size-8 text-primary-light" aria-hidden="true" />
        </div>
      ) : null}
      <div className="flex items-center justify-between gap-3 p-3">
        <div className="min-w-0">
          <p className="truncate text-sm text-ink">{file.fileName}</p>
          <p className="text-xs text-ink-secondary">
            {(file.file.size / (1024 * 1024)).toFixed(2)} MB
          </p>
        </div>
        <DropzoneRemoveFile
          variant="ghost"
          className="shrink-0 text-ink-secondary hover:text-ink"
        >
          <Trash2 className="size-4" aria-hidden="true" />
        </DropzoneRemoveFile>
      </div>
    </DropzoneFileListItem>
  );
}
