import { useCallback, useEffect } from "react";

import { useClinicId } from "@/lib/hooks/use-active-clinic";
import {
  useClinicServerSeed,
  useServerSeed,
} from "@/lib/hooks/use-server-seed";
import { isInitialLoading } from "@/stores/query-state";
import {
  useTreatmentStore,
  type TreatmentInput,
  type TreatmentUpdateInput,
} from "@/stores/treatment-store";
import type { TreatmentWithInventory } from "@/types/database.types";

export type {
  TreatmentInventoryLinkInput,
  TreatmentInput,
  TreatmentUpdateInput,
} from "@/stores/treatment-store";

export function useTreatments(initialData?: TreatmentWithInventory[]) {
  const entry = useTreatmentStore((state) => state.list);
  const fetchTreatments = useTreatmentStore((state) => state.fetchTreatments);
  const clinicId = useClinicId();
  const seededData = useClinicServerSeed(clinicId, initialData);
  const hasClientData = entry.data != null;

  useEffect(() => {
    if (seededData !== undefined && !hasClientData) {
      return;
    }

    void fetchTreatments();
  }, [clinicId, fetchTreatments, hasClientData, seededData]);

  const data = entry.data ?? seededData;
  const refresh = useCallback(() => {
    if (useTreatmentStore.getState().list.loading) {
      return Promise.resolve();
    }

    return fetchTreatments();
  }, [fetchTreatments]);

  return {
    data,
    isLoading: data == null && isInitialLoading(entry),
    isRefreshing: entry.loading,
    error: entry.error,
    refresh,
  };
}

export function useTreatment(treatmentOrId: TreatmentWithInventory | string) {
  const treatmentId =
    typeof treatmentOrId === "string" ? treatmentOrId : treatmentOrId.id;
  const initialData =
    typeof treatmentOrId === "string" ? undefined : treatmentOrId;
  const entry = useTreatmentStore((state) => state.byId[treatmentId]);
  const fetchTreatment = useTreatmentStore((state) => state.fetchTreatment);
  const seededData = useServerSeed(
    treatmentId,
    initialData?.id ?? "",
    initialData,
  );
  const hasClientData = entry?.data != null;

  useEffect(() => {
    if (!treatmentId || (seededData !== undefined && !hasClientData)) {
      return;
    }

    void fetchTreatment(treatmentId);
  }, [fetchTreatment, hasClientData, seededData, treatmentId]);

  const data = entry?.data ?? seededData;

  return {
    data,
    isLoading: data == null && isInitialLoading(entry),
    error: entry?.error,
  };
}

export function useCreateTreatment() {
  const createTreatment = useTreatmentStore((state) => state.createTreatment);
  const isPending = useTreatmentStore((state) => state.creating);
  const error = useTreatmentStore((state) => state.createError);

  const mutate = useCallback(
    (
      input: TreatmentInput,
      options?: { onSuccess?: () => void; onError?: (error: Error) => void },
    ) => {
      createTreatment(input)
        .then(() => options?.onSuccess?.())
        .catch((cause) =>
          options?.onError?.(
            cause instanceof Error ? cause : new Error(String(cause)),
          ),
        );
    },
    [createTreatment],
  );

  return { mutate, isPending, error };
}

export function useUpdateTreatment() {
  const updateTreatment = useTreatmentStore((state) => state.updateTreatment);
  const isPending = useTreatmentStore((state) => state.updating);
  const error = useTreatmentStore((state) => state.updateError);

  const mutate = useCallback(
    (
      treatmentId: string,
      input: TreatmentUpdateInput,
      options?: { onSuccess?: () => void; onError?: (error: Error) => void },
    ) => {
      updateTreatment(treatmentId, input)
        .then(() => options?.onSuccess?.())
        .catch((cause) =>
          options?.onError?.(
            cause instanceof Error ? cause : new Error(String(cause)),
          ),
        );
    },
    [updateTreatment],
  );

  return { mutate, isPending, error };
}

export function useDeleteTreatment() {
  const deleteTreatment = useTreatmentStore((state) => state.deleteTreatment);
  const isPending = useTreatmentStore((state) => state.deleting);
  const error = useTreatmentStore((state) => state.deleteError);

  const mutate = useCallback(
    (
      treatmentId: string,
      options?: { onSuccess?: () => void; onError?: (error: Error) => void },
    ) => {
      deleteTreatment(treatmentId)
        .then(() => options?.onSuccess?.())
        .catch((cause) =>
          options?.onError?.(
            cause instanceof Error ? cause : new Error(String(cause)),
          ),
        );
    },
    [deleteTreatment],
  );

  return { mutate, isPending, error };
}
