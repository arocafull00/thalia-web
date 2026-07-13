"use client";

import { Download } from "lucide-react";

import AppDialog from "@/components/ui/app-dialog";
import AppDialogContent from "@/components/ui/app-dialog-content";
import { Button } from "@/components/ui/button";
import { Notice } from "@/components/ui/primitives/notice";
import { PATIENT_FILES_COPY } from "@/copy/patient-files-copy";
import { usePatientFileUrl } from "@/lib/hooks/use-patient-files";
import {
  isPatientFileImage,
  isPatientFilePdf,
} from "@/lib/patient-file-storage";
import type { PatientFile } from "@/types/database.types";

import PatientFilePdfViewerContent from "./patient-file-pdf-viewer-content";
import PatientFileViewerToolbar from "./patient-file-viewer-toolbar";

import "@pdfslick/react/dist/pdf_viewer.css";

type PatientFileViewerProps = {
  file: PatientFile | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDownload: (file: PatientFile) => void;
};

export default function PatientFileViewer({
  file,
  open,
  onOpenChange,
  onDownload,
}: PatientFileViewerProps) {
  const signedUrl = usePatientFileUrl(file);

  if (!file) {
    return null;
  }

  const isPdf = isPatientFilePdf(file.mime_type);
  const isImage = isPatientFileImage(file.mime_type);
  const isDocx = !isPdf && !isImage;

  return (
    <AppDialog open={open} onOpenChange={onOpenChange}>
      <AppDialogContent
        showClose={false}
        className="flex h-[90vh] max-h-[90vh] w-[95vw] max-w-6xl flex-col overflow-hidden p-0"
      >
        {isPdf && signedUrl ? (
          <PatientFilePdfViewerContent
            file={file}
            signedUrl={signedUrl}
            onClose={() => onOpenChange(false)}
            onDownload={() => onDownload(file)}
          />
        ) : null}

        {isImage ? (
          <>
            <PatientFileViewerToolbar
              title={file.original_filename}
              onDownload={() => onDownload(file)}
              onClose={() => onOpenChange(false)}
            />
            <div className="flex min-h-0 flex-1 items-center justify-center overflow-auto bg-canvas p-6">
              {!signedUrl ? (
                <p className="text-sm text-ink-secondary">
                  {PATIENT_FILES_COPY.viewer.loading}
                </p>
              ) : null}
              {signedUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={signedUrl}
                  alt={file.original_filename}
                  className="max-h-full max-w-full object-contain"
                />
              ) : null}
            </div>
          </>
        ) : null}

        {isDocx ? (
          <>
            <PatientFileViewerToolbar
              title={file.original_filename}
              onDownload={() => onDownload(file)}
              onClose={() => onOpenChange(false)}
            />
            <div className="flex min-h-0 flex-1 flex-col items-center justify-center gap-4 bg-canvas px-6 py-12 text-center">
              <p className="text-lg font-medium text-ink">
                {PATIENT_FILES_COPY.viewer.docxTitle}
              </p>
              <p className="max-w-md text-sm text-ink-secondary">
                {PATIENT_FILES_COPY.viewer.docxDescription}
              </p>
              <Button type="button" onClick={() => onDownload(file)}>
                <Download aria-hidden="true" />
                {PATIENT_FILES_COPY.viewer.download}
              </Button>
            </div>
          </>
        ) : null}

        {isPdf && !signedUrl ? (
          <div className="flex min-h-0 flex-1 flex-col">
            <PatientFileViewerToolbar
              title={file.original_filename}
              onDownload={() => onDownload(file)}
              onClose={() => onOpenChange(false)}
            />
            <div className="flex flex-1 items-center justify-center p-6">
              <Notice
                tone="danger"
                message={
                  signedUrl === null
                    ? PATIENT_FILES_COPY.viewer.error
                    : PATIENT_FILES_COPY.viewer.loading
                }
              />
            </div>
          </div>
        ) : null}
      </AppDialogContent>
    </AppDialog>
  );
}
