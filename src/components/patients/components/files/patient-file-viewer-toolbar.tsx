"use client";

import { Download, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { PATIENT_FILES_COPY } from "@/copy/patient-files-copy";

type PatientFileViewerToolbarProps = {
  title: string;
  onDownload: () => void;
  onClose: () => void;
};

export default function PatientFileViewerToolbar({
  title,
  onDownload,
  onClose,
}: PatientFileViewerToolbarProps) {
  return (
    <div className="flex shrink-0 items-center justify-between gap-3 border-b border-border-subtle bg-surface px-4 py-3">
      <p className="min-w-0 truncate text-sm font-medium text-ink">{title}</p>
      <div className="flex items-center gap-2">
        <Button type="button" variant="outline" size="sm" onClick={onDownload}>
          <Download aria-hidden="true" />
          {PATIENT_FILES_COPY.viewer.download}
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={onClose}
          aria-label={PATIENT_FILES_COPY.viewer.close}
        >
          <X aria-hidden="true" />
        </Button>
      </div>
    </div>
  );
}
