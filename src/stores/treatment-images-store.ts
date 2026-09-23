import { create } from "zustand";
import { clinicPersistOptions } from "@/stores/clinic-query-persist";
import { persist } from "zustand/middleware";

import { getTreatmentPatientImagesPage } from "@/dal/patient-images.dal";
import { getActiveClinicId } from "@/lib/active-clinic-id";
import { logger } from "@/lib/logger";
import { getQueryEpoch, isCurrentQueryEpoch } from "@/stores/query-epoch";
import { isAccessDenied, shareEqualData } from "@/stores/query-state";
import type { PatientImageWithPatient } from "@/types/database.types";

const TREATMENT_IMAGES_PAGE_SIZE = 12;

type TreatmentImagesEntry = {
  clinicId: string;
  data: PatientImageWithPatient[] | null;
  fetchedAt?: number;
  loading: boolean;
  loadingMore: boolean;
  hasMore: boolean;
  error: Error | null;
};

type TreatmentImagesStore = {
  byTreatmentId: Record<string, TreatmentImagesEntry>;
  fetchTreatmentImages: (treatmentId: string) => Promise<void>;
  loadMoreTreatmentImages: (treatmentId: string) => Promise<void>;
};

function toError(cause: unknown) {
  return cause instanceof Error ? cause : new Error(String(cause));
}

export const useTreatmentImagesStore = create<TreatmentImagesStore>()(persist(
  (set, get) => ({
    byTreatmentId: {},

    fetchTreatmentImages: async (treatmentId) => {
      const epoch = getQueryEpoch();
      const clinicId = getActiveClinicId();

      if (!clinicId) {
        return;
      }

      const current = get().byTreatmentId[treatmentId];

      if (current?.clinicId === clinicId && current.loading) {
        return;
      }

      const previous = current?.clinicId === clinicId ? current : undefined;

      set({
        byTreatmentId: {
          ...get().byTreatmentId,
          [treatmentId]: {
            clinicId,
            data: previous?.data ?? null,
            fetchedAt: previous?.fetchedAt,
            loading: true,
            loadingMore: false,
            hasMore: previous?.hasMore ?? false,
            error: null,
          },
        },
      });

      try {
        const page = await getTreatmentPatientImagesPage(
          clinicId,
          treatmentId,
          0,
          TREATMENT_IMAGES_PAGE_SIZE,
        );
        const latest = get().byTreatmentId[treatmentId];

        if (!isCurrentQueryEpoch(epoch) || latest?.clinicId !== clinicId) {
          return;
        }

        set({
          byTreatmentId: {
            ...get().byTreatmentId,
            [treatmentId]: {
              clinicId,
              data: latest.data === null ? page.images : shareEqualData(latest.data, page.images),
              fetchedAt: Date.now(),
              loading: false,
              loadingMore: false,
              hasMore: page.hasMore,
              error: null,
            },
          },
        });
      } catch (cause) {
        const error = toError(cause);
        logger.captureException(error, {
          store: "treatment-images-store",
          action: "fetchTreatmentImages",
          clinicId,
          treatmentId,
        });
        const latest = get().byTreatmentId[treatmentId];

        if (!isCurrentQueryEpoch(epoch) || latest?.clinicId !== clinicId) {
          return;
        }

        set({
          byTreatmentId: {
            ...get().byTreatmentId,
            [treatmentId]: {
              clinicId,
              data: isAccessDenied(error) ? null : (previous?.data ?? null),
              loading: false,
              loadingMore: false,
              hasMore: previous?.hasMore ?? false,
              error,
            },
          },
        });
      }
    },

    loadMoreTreatmentImages: async (treatmentId) => {
      const epoch = getQueryEpoch();
      const clinicId = getActiveClinicId();
      const current = get().byTreatmentId[treatmentId];

      if (
        !clinicId ||
        current?.clinicId !== clinicId ||
        current.data === null ||
        current.loadingMore ||
        !current.hasMore
      ) {
        return;
      }

      set({
        byTreatmentId: {
          ...get().byTreatmentId,
          [treatmentId]: { ...current, loadingMore: true, error: null },
        },
      });

      try {
        const page = await getTreatmentPatientImagesPage(
          clinicId,
          treatmentId,
          current.data.length,
          TREATMENT_IMAGES_PAGE_SIZE,
        );
        const latest = get().byTreatmentId[treatmentId];

        if (
          !isCurrentQueryEpoch(epoch) ||
          latest?.clinicId !== clinicId ||
          latest.data === null
        ) {
          return;
        }

        const existingIds = new Set(latest.data.map((image) => image.id));
        const newImages = page.images.filter(
          (image) => !existingIds.has(image.id),
        );

        set({
          byTreatmentId: {
            ...get().byTreatmentId,
            [treatmentId]: {
              ...latest,
              data: [...latest.data, ...newImages],
              loadingMore: false,
              hasMore: page.hasMore,
              error: null,
            },
          },
        });
      } catch (cause) {
        const error = toError(cause);
        logger.captureException(error, {
          store: "treatment-images-store",
          action: "loadMoreTreatmentImages",
          clinicId,
          treatmentId,
        });
        const latest = get().byTreatmentId[treatmentId];

        if (!isCurrentQueryEpoch(epoch) || latest?.clinicId !== clinicId) {
          return;
        }

        set({
          byTreatmentId: {
            ...get().byTreatmentId,
            [treatmentId]: {
              ...latest,
              loadingMore: false,
              error,
            },
          },
        });
      }
    },
  }),
  clinicPersistOptions<TreatmentImagesStore>("treatment-images", ["byTreatmentId"]),
));
