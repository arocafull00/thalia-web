import { create } from "zustand";
import { persist } from "zustand/middleware";

import {
  DEFAULT_PATIENT_GALLERY_DENSITY,
  type PatientGalleryDensity,
} from "@/lib/patient-gallery-density";
import { createWebPersistStorage } from "@/lib/web-storage";

type PatientGalleryPreferencesStore = {
  density: PatientGalleryDensity;
  hydrated: boolean;
  setDensity: (density: PatientGalleryDensity) => void;
};

export const usePatientGalleryPreferencesStore =
  create<PatientGalleryPreferencesStore>()(
    persist(
      (set) => ({
        density: DEFAULT_PATIENT_GALLERY_DENSITY,
        hydrated: false,
        setDensity: (density) => set({ density }),
      }),
      {
        name: "thalia-gallery-density",
        storage: createWebPersistStorage(),
        version: 1,
        partialize: (state) => ({ density: state.density }),
        onRehydrateStorage: () => () => {
          usePatientGalleryPreferencesStore.setState({ hydrated: true });
        },
      },
    ),
  );

usePatientGalleryPreferencesStore.persist.onFinishHydration(() => {
  usePatientGalleryPreferencesStore.setState({ hydrated: true });
});

if (usePatientGalleryPreferencesStore.persist.hasHydrated()) {
  usePatientGalleryPreferencesStore.setState({ hydrated: true });
}
