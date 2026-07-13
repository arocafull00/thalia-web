"use client";

import { usePDFSlick } from "@pdfslick/react";

import { PATIENT_FILES_COPY } from "@/copy/patient-files-copy";
import type { PatientFile } from "@/types/database.types";

import PatientFilePdfNavigation from "./patient-file-pdf-navigation";
import PatientFilePdfViewer from "./patient-file-pdf-viewer";

type PatientFilePdfViewerContentProps = {
  file: PatientFile;
  signedUrl: string;
  onClose: () => void;
  onDownload: () => void;
};

export default function PatientFilePdfViewerContent({
  file,
  signedUrl,
  onClose,
  onDownload,
}: PatientFilePdfViewerContentProps) {
  const { viewerRef, usePDFSlickStore, PDFSlickViewer, isDocumentLoaded } =
    usePDFSlick(signedUrl, {
      singlePageViewer: false,
      scaleValue: "page-fit",
    });

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <PatientFilePdfNavigation
        usePDFSlickStore={usePDFSlickStore}
        onDownload={onDownload}
        onClose={onClose}
      />
      <div className="relative min-h-0 flex-1 bg-canvas">
        {!isDocumentLoaded ? (
          <p className="absolute inset-0 flex items-center justify-center text-sm text-ink-secondary">
            {PATIENT_FILES_COPY.viewer.loading}
          </p>
        ) : null}
        <PatientFilePdfViewer
          viewerRef={viewerRef}
          usePDFSlickStore={usePDFSlickStore}
          PDFSlickViewer={PDFSlickViewer}
          filename={file.original_filename}
        />
      </div>
    </div>
  );
}
