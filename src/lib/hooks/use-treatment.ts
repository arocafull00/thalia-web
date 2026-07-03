import { useCallback, useEffect } from "react";

import { isInitialLoading } from "@/stores/query-state";
import {
  useTreatmentStore,
  type TreatmentInput,
  type TreatmentUpdateInput,
} from "@/stores/treatment-store";

export type {
  TreatmentInventoryLinkInput,
  TreatmentInput,
  TreatmentUpdateInput,
} from "@/stores/treatment-store";

export function useTreatments() {
  const entry = useTreatmentStore((state) => state.list);
  const fetchTreatments = useTreatmentStore((state) => state.fetchTreatments);

  useEffect(() => {
    void fetchTreatments();
  }, [fetchTreatments]);

  return {
    data: entry.data ?? undefined,
    isLoading: isInitialLoading(entry),
    error: entry.error,
  };
}

export function useTreatment(treatmentId: string) {
  const entry = useTreatmentStore((state) => state.byId[treatmentId]);
  const fetchTreatment = useTreatmentStore((state) => state.fetchTreatment);

  useEffect(() => {
    if (!treatmentId) {
      return;
    }

    void fetchTreatment(treatmentId);
  }, [fetchTreatment, treatmentId]);

  return {
    data: entry?.data,
    isLoading: isInitialLoading(entry),
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
