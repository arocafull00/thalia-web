"use client";

import type { TUsePDFSlickStore } from "@pdfslick/react";
import {
  ChevronLeft,
  ChevronRight,
  Download,
  Minus,
  Plus,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { PATIENT_FILES_COPY } from "@/copy/patient-files-copy";

type PatientFilePdfNavigationProps = {
  usePDFSlickStore: TUsePDFSlickStore;
  onDownload: () => void;
  onClose: () => void;
};

export default function PatientFilePdfNavigation({
  usePDFSlickStore,
  onDownload,
  onClose,
}: PatientFilePdfNavigationProps) {
  const pageNumber = usePDFSlickStore((state) => state.pageNumber);
  const numPages = usePDFSlickStore((state) => state.numPages);
  const pdfSlick = usePDFSlickStore((state) => state.pdfSlick);

  const handlePreviousPage = () => {
    if (!pdfSlick || pageNumber <= 1) {
      return;
    }

    pdfSlick.gotoPage(pageNumber - 1);
  };

  const handleNextPage = () => {
    if (!pdfSlick || pageNumber >= numPages) {
      return;
    }

    pdfSlick.gotoPage(pageNumber + 1);
  };

  const handleZoomOut = () => {
    pdfSlick?.decreaseScale();
  };

  const handleZoomIn = () => {
    pdfSlick?.increaseScale();
  };

  return (
    <div className="flex shrink-0 items-center justify-between gap-3 border-b border-border-subtle bg-surface px-4 py-3">
      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={handlePreviousPage}
          disabled={pageNumber <= 1}
          aria-label={PATIENT_FILES_COPY.viewer.previousPage}
        >
          <ChevronLeft aria-hidden="true" />
        </Button>
        <span className="min-w-28 text-center text-sm text-ink-secondary">
          {PATIENT_FILES_COPY.viewer.page(pageNumber, numPages)}
        </span>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={handleNextPage}
          disabled={pageNumber >= numPages}
          aria-label={PATIENT_FILES_COPY.viewer.nextPage}
        >
          <ChevronRight aria-hidden="true" />
        </Button>
      </div>

      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={handleZoomOut}
          aria-label={PATIENT_FILES_COPY.viewer.zoomOut}
        >
          <Minus aria-hidden="true" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={handleZoomIn}
          aria-label={PATIENT_FILES_COPY.viewer.zoomIn}
        >
          <Plus aria-hidden="true" />
        </Button>
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
