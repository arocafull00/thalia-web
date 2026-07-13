"use client";

import { type usePDFSlick } from "@pdfslick/react";
import type { RefCallback } from "react";

type PatientFilePdfViewerProps = {
  viewerRef: RefCallback<HTMLElement>;
  usePDFSlickStore: ReturnType<typeof usePDFSlick>["usePDFSlickStore"];
  PDFSlickViewer: ReturnType<typeof usePDFSlick>["PDFSlickViewer"];
  filename: string;
};

export default function PatientFilePdfViewer({
  viewerRef,
  usePDFSlickStore,
  PDFSlickViewer: PDFViewerComponent,
  filename,
}: PatientFilePdfViewerProps) {
  return (
    <div className="absolute inset-0 overflow-auto">
      <PDFViewerComponent
        viewerRef={viewerRef}
        usePDFSlickStore={usePDFSlickStore}
        className="pdfSlick h-full w-full"
      />
      <span className="sr-only">{filename}</span>
    </div>
  );
}
