export type PatientGalleryDensity = "compact" | "comfortable" | "large";

export const DEFAULT_PATIENT_GALLERY_DENSITY: PatientGalleryDensity =
  "comfortable";

export const PATIENT_GALLERY_DENSITY_STORAGE_KEY = "thalia-gallery-density:v1";

const VALID_DENSITIES: PatientGalleryDensity[] = [
  "compact",
  "comfortable",
  "large",
];

export const PATIENT_GALLERY_DENSITY_GRID_CLASSES: Record<
  PatientGalleryDensity,
  string
> = {
  compact: "grid grid-cols-3 gap-2 sm:grid-cols-4 lg:grid-cols-6",
  comfortable: "grid grid-cols-2 gap-3 lg:grid-cols-4",
  large: "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3",
};

function isPatientGalleryDensity(
  value: string,
): value is PatientGalleryDensity {
  return VALID_DENSITIES.includes(value as PatientGalleryDensity);
}

export function readStoredPatientGalleryDensity(): PatientGalleryDensity {
  if (typeof window === "undefined") {
    return DEFAULT_PATIENT_GALLERY_DENSITY;
  }

  try {
    const stored = localStorage.getItem(PATIENT_GALLERY_DENSITY_STORAGE_KEY);

    if (!stored || !isPatientGalleryDensity(stored)) {
      return DEFAULT_PATIENT_GALLERY_DENSITY;
    }

    return stored;
  } catch {
    return DEFAULT_PATIENT_GALLERY_DENSITY;
  }
}

export function writeStoredPatientGalleryDensity(
  density: PatientGalleryDensity,
): void {
  if (typeof window === "undefined") {
    return;
  }

  try {
    localStorage.setItem(PATIENT_GALLERY_DENSITY_STORAGE_KEY, density);
  } catch {}
}
