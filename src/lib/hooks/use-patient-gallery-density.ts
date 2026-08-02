"use client";

import { usePatientGalleryPreferencesStore } from "@/stores/patient-gallery-preferences-store";

export function usePatientGalleryDensity() {
  const density = usePatientGalleryPreferencesStore((state) => state.density);
  const setDensity = usePatientGalleryPreferencesStore(
    (state) => state.setDensity,
  );

  return { density, setDensity };
}
