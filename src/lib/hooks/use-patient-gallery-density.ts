"use client";

import { useState } from "react";

import {
  readStoredPatientGalleryDensity,
  writeStoredPatientGalleryDensity,
  type PatientGalleryDensity,
} from "@/lib/patient-gallery-density";

export function usePatientGalleryDensity() {
  const [density, setDensityState] = useState<PatientGalleryDensity>(() =>
    readStoredPatientGalleryDensity(),
  );

  const setDensity = (next: PatientGalleryDensity) => {
    setDensityState(next);
    writeStoredPatientGalleryDensity(next);
  };

  return { density, setDensity };
}
