import { endOfDay, startOfDay } from "date-fns";
import { useCallback, useEffect } from "react";

import {
  appointmentsKey,
  useAppointmentsStore,
  type AppointmentFormInput,
  type AppointmentUpdateInput,
} from "@/stores/appointments-store";
import { isInitialLoading } from "@/stores/query-state";

export type { AppointmentFormInput, AppointmentUpdateInput };

export function useAppointments(
  dateOrRange: Date | { start: Date; end: Date },
  employeeId: string | null,
) {
  const rangeStart =
    dateOrRange instanceof Date ? startOfDay(dateOrRange) : dateOrRange.start;
  const rangeEnd =
    dateOrRange instanceof Date ? endOfDay(dateOrRange) : dateOrRange.end;
  const start = rangeStart.toISOString();
  const end = rangeEnd.toISOString();
  const key = appointmentsKey(start, end, employeeId);

  const entry = useAppointmentsStore((state) => state.byRange[key]);
  const fetchAppointments = useAppointmentsStore(
    (state) => state.fetchAppointments,
  );
  const subscribeRealtime = useAppointmentsStore(
    (state) => state.subscribeRealtime,
  );
  const unsubscribeRealtime = useAppointmentsStore(
    (state) => state.unsubscribeRealtime,
  );

  useEffect(() => {
    subscribeRealtime();
    return () => unsubscribeRealtime();
  }, [subscribeRealtime, unsubscribeRealtime]);

  useEffect(() => {
    void fetchAppointments({
      start: new Date(start),
      end: new Date(end),
      employeeId,
    });
  }, [employeeId, end, fetchAppointments, start]);

  return {
    data: entry?.data,
    isLoading: isInitialLoading(entry),
    error: entry?.error,
  };
}

export function useAppointment(appointmentId: string) {
  const entry = useAppointmentsStore((state) => state.byId[appointmentId]);
  const fetchAppointment = useAppointmentsStore(
    (state) => state.fetchAppointment,
  );

  useEffect(() => {
    void fetchAppointment(appointmentId);
  }, [appointmentId, fetchAppointment]);

  return {
    data: entry?.data,
    isLoading: isInitialLoading(entry),
    error: entry?.error,
  };
}

export function useCreateAppointment() {
  const createAppointment = useAppointmentsStore(
    (state) => state.createAppointment,
  );
  const isPending = useAppointmentsStore((state) => state.creating);
  const error = useAppointmentsStore((state) => state.createError);

  const mutate = useCallback(
    (
      input: AppointmentFormInput,
      options?: { onSuccess?: () => void; onError?: (error: Error) => void },
    ) => {
      createAppointment(input)
        .then(() => options?.onSuccess?.())
        .catch((cause) =>
          options?.onError?.(
            cause instanceof Error ? cause : new Error(String(cause)),
          ),
        );
    },
    [createAppointment],
  );

  const mutateAsync = useCallback(
    (input: AppointmentFormInput) => createAppointment(input),
    [createAppointment],
  );

  return { mutate, mutateAsync, isPending, error };
}

export function useUpdateAppointment() {
  const updateAppointment = useAppointmentsStore(
    (state) => state.updateAppointment,
  );
  const isPending = useAppointmentsStore((state) => state.updating);
  const error = useAppointmentsStore((state) => state.updateError);

  const mutateAsync = useCallback(
    (input: AppointmentUpdateInput) => updateAppointment(input),
    [updateAppointment],
  );

  return { mutateAsync, isPending, error };
}

export function useUpdateAppointmentStatus() {
  const updateAppointmentStatus = useAppointmentsStore(
    (state) => state.updateAppointmentStatus,
  );
  const isPending = useAppointmentsStore((state) => state.updatingStatus);
  const error = useAppointmentsStore((state) => state.updateStatusError);

  const mutate = useCallback(
    (
      {
        id,
        status,
      }: { id: string; status: Parameters<typeof updateAppointmentStatus>[1] },
      options?: { onSuccess?: () => void },
    ) => {
      updateAppointmentStatus(id, status).then(() => options?.onSuccess?.());
    },
    [updateAppointmentStatus],
  );

  return { mutate, isPending, error };
}

export function useRescheduleAppointment() {
  const rescheduleAppointment = useAppointmentsStore(
    (state) => state.rescheduleAppointment,
  );
  const isPending = useAppointmentsStore((state) => state.rescheduling);
  const error = useAppointmentsStore((state) => state.rescheduleError);

  const mutateAsync = useCallback(
    ({ id, startsAt, endsAt }: { id: string; startsAt: Date; endsAt: Date }) =>
      rescheduleAppointment(id, startsAt, endsAt),
    [rescheduleAppointment],
  );

  return { mutateAsync, isPending, error };
}
