"use client";

import { Trash2 } from "lucide-react";

import {
  DropzoneFileListItem,
  DropzoneRemoveFile,
  type FileStatus,
} from "@/components/ui/dropzone";

type CampaignImageDropzoneFileItemProps = {
  file: FileStatus<string, string>;
};

export default function CampaignImageDropzoneFileItem({
  file,
}: CampaignImageDropzoneFileItemProps) {
  return (
    <DropzoneFileListItem
      className="overflow-hidden rounded-xl border border-border bg-canvas p-0 shadow-none"
      file={file}
    >
      {file.status === "pending" ? (
        <div className="aspect-video animate-pulse bg-border/40" />
      ) : null}
      {file.status === "success" ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={file.result}
          alt={file.fileName}
          className="aspect-video w-full object-cover"
        />
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
