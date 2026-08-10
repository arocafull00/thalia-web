import { fromZonedTime } from "date-fns-tz";
import { useCallback, useMemo, useState } from "react";

import { PATIENT_GALLERY_COPY } from "@/copy/patient-gallery-copy";
import type {
  PatientImagesFilters,
  PatientImagesSort,
} from "@/dal/patient-images.dal";
import { CLINIC_TIME_ZONE } from "@/lib/constants";
import { useDebouncedValue } from "@/lib/hooks/use-debounced-value";
import { usePatientGalleryDensity } from "@/lib/hooks/use-patient-gallery-density";
import {
  usePatientImageViewerSlides,
  usePatientImages,
} from "@/lib/hooks/use-patient-images";
import { useTreatments } from "@/lib/hooks/use-treatment";
import { groupImagesByDate } from "@/lib/patient-gallery-grouping";
import type { PatientImage, PatientImagePhase } from "@/types/database.types";

const SEARCH_DEBOUNCE_MS = 300;

export type PatientGalleryFilterValues = {
  phase: string;
  treatmentId: string;
  from: string;
  to: string;
  sort: PatientImagesSort;
};

const DEFAULT_FILTERS: PatientGalleryFilterValues = {
  phase: "",
  treatmentId: "",
  from: "",
  to: "",
  sort: "recent",
};

const PHASE_OPTIONS = [
  { label: PATIENT_GALLERY_COPY.phases.antes, value: "antes" },
  { label: PATIENT_GALLERY_COPY.phases.durante, value: "durante" },
  { label: PATIENT_GALLERY_COPY.phases.despues, value: "despues" },
];

function toCapturedBoundary(value: string, endOfDay: boolean) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return null;
  }

  const time = endOfDay ? "23:59:59.999" : "00:00:00.000";
  return fromZonedTime(`${value}T${time}`, CLINIC_TIME_ZONE).toISOString();
}

function parsePhase(value: string): PatientImagePhase | null {
  if (value === "antes" || value === "durante" || value === "despues") {
    return value;
  }

  return null;
}

export function usePatientGallery(patientId: string) {
  const [search, setSearch] = useState("");
  const [filters, setFilters] =
    useState<PatientGalleryFilterValues>(DEFAULT_FILTERS);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [sheetKey, setSheetKey] = useState(0);
  const [selectionMode, setSelectionMode] = useState(false);
  const [selectedImageIds, setSelectedImageIds] = useState<string[]>([]);
  const [comparisonOpen, setComparisonOpen] = useState(false);
  const [viewerOpen, setViewerOpen] = useState(false);
  const [viewerIndex, setViewerIndex] = useState(0);
  const { density, setDensity } = usePatientGalleryDensity();
  const treatmentsQuery = useTreatments();
  const debouncedSearch = useDebouncedValue(search, SEARCH_DEBOUNCE_MS);

  const queryFilters = useMemo<PatientImagesFilters>(
    () => ({
      search: debouncedSearch,
      phase: parsePhase(filters.phase),
      treatmentId: filters.treatmentId || null,
      capturedFrom: toCapturedBoundary(filters.from, false),
      capturedTo: toCapturedBoundary(filters.to, true),
      sort: filters.sort,
    }),
    [debouncedSearch, filters],
  );
  const imagesQuery = usePatientImages(patientId, queryFilters);
  const images = useMemo(() => imagesQuery.data ?? [], [imagesQuery.data]);
  const viewerSlides = usePatientImageViewerSlides(images);
  const visibleGroups = useMemo(
    () => groupImagesByDate(images, filters.sort),
    [filters.sort, images],
  );
  const eagerImageIds = useMemo(
    () => new Set(images.slice(0, 4).map((image) => image.id)),
    [images],
  );
  const selectedImages = useMemo(
    () =>
      images.filter((image) => selectedImageIds.includes(image.id)).slice(0, 2),
    [images, selectedImageIds],
  );
  const treatmentOptions = useMemo(
    () =>
      (treatmentsQuery.data ?? []).map((treatment) => ({
        value: treatment.id,
        label: treatment.name,
      })),
    [treatmentsQuery.data],
  );
  const hasActiveFilters = Boolean(
    search.trim() ||
    filters.phase ||
    filters.treatmentId ||
    filters.from ||
    filters.to,
  );

  const resetInteractiveState = useCallback(() => {
    setSelectionMode(false);
    setSelectedImageIds([]);
    setComparisonOpen(false);
    setViewerOpen(false);
    setViewerIndex(0);
  }, []);

  const updateFilters = useCallback(
    (updates: Partial<PatientGalleryFilterValues>) => {
      resetInteractiveState();
      setFilters((current) => {
        const next = { ...current, ...updates };

        if (updates.from && next.to && updates.from > next.to) {
          next.to = updates.from;
        }

        if (updates.to && next.from && updates.to < next.from) {
          next.from = updates.to;
        }

        return next;
      });
    },
    [resetInteractiveState],
  );

  const handleSearchChange = useCallback(
    (value: string) => {
      resetInteractiveState();
      setSearch(value);
    },
    [resetInteractiveState],
  );

  const handleToggleSelect = useCallback((image: PatientImage) => {
    setSelectedImageIds((current) => {
      if (current.includes(image.id)) {
        return current.filter((id) => id !== image.id);
      }

      if (current.length >= 2) {
        return [current[1]!, image.id];
      }

      return [...current, image.id];
    });
  }, []);

  const handleOpenViewer = useCallback(
    (image: PatientImage) => {
      const index = images.findIndex((entry) => entry.id === image.id);

      if (index === -1) {
        return;
      }

      setViewerIndex(index);
      setViewerOpen(true);
    },
    [images],
  );

  const handleCloseSelectionMode = useCallback(() => {
    setSelectionMode(false);
    setSelectedImageIds([]);
  }, []);

  const handleOpenFiltersSheet = useCallback(() => {
    setSheetKey((key) => key + 1);
    setSheetOpen(true);
  }, []);

  const handleApplyFilters = useCallback(
    (updates: PatientGalleryFilterValues) => updateFilters(updates),
    [updateFilters],
  );

  const handleClearFilters = useCallback(() => {
    updateFilters(DEFAULT_FILTERS);
  }, [updateFilters]);

  return {
    comparisonOpen,
    density,
    eagerImageIds,
    filters,
    handleApplyFilters,
    handleClearFilters,
    handleCloseSelectionMode,
    handleOpenFiltersSheet,
    handleOpenViewer,
    handleSearchChange,
    handleToggleSelect,
    hasActiveFilters,
    images,
    imagesQuery,
    phaseOptions: PHASE_OPTIONS,
    search,
    selectedImageIds,
    selectedImages,
    selectionMode,
    setComparisonOpen,
    setDensity,
    setFilters: updateFilters,
    setSelectionMode,
    setSheetOpen,
    setViewerIndex,
    setViewerOpen,
    sheetKey,
    sheetOpen,
    treatmentOptions,
    viewerIndex,
    viewerOpen,
    viewerSlides,
    visibleGroups,
  };
}
