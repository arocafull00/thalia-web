export type PatientGalleryDensity = "compact" | "comfortable" | "large";

export const DEFAULT_PATIENT_GALLERY_DENSITY: PatientGalleryDensity =
  "comfortable";

export const PATIENT_GALLERY_DENSITY_GRID_CLASSES: Record<
  PatientGalleryDensity,
  string
> = {
  compact: "grid grid-cols-3 gap-2 sm:grid-cols-4 lg:grid-cols-6",
  comfortable: "grid grid-cols-2 gap-3 lg:grid-cols-4",
  large: "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3",
};
