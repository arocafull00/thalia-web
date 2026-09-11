"use client";

import dynamic from "next/dynamic";

import type { PatientImageViewerSlide } from "@/lib/hooks/use-patient-images";

const PatientImageViewerLightbox = dynamic(
  () => import("./patient-image-viewer-lightbox"),
  { ssr: false },
);

type PatientImageViewerProps = {
  slides: PatientImageViewerSlide[];
  activeIndex: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onActiveIndexChange: (index: number) => void;
};

export default function PatientImageViewer(props: PatientImageViewerProps) {
  if (!props.open) {
    return null;
  }

  return <PatientImageViewerLightbox {...props} />;
}
