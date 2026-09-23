"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useRef } from "react";
import { toast } from "sonner";

import { SETTINGS_COPY } from "@/copy/settings-copy";
import { disconnectGoogleCalendar } from "@/dal/google-calendar.dal";
import { useRevalidateOnEntry } from "@/lib/hooks/use-revalidate-on-entry";
import { logger } from "@/lib/logger";
import { useAuthStore } from "@/stores/auth-store";
import { useCalendarConnectionStore } from "@/stores/calendar-connection-store";

const OUTCOME_PARAM = "calendario";

export function useGoogleCalendarConnection() {
  const profile = useAuthStore((state) => state.profile);
  const router = useRouter();
  const searchParams = useSearchParams();
  const employeeId = profile?.id;
  const entry = useCalendarConnectionStore((state) => employeeId ? state.byEmployeeId[employeeId] : undefined);
  const fetchConnection = useCalendarConnectionStore((state) => state.fetchConnection);
  const clearConnection = useCalendarConnectionStore((state) => state.clearConnection);
  useRevalidateOnEntry(employeeId ? `calendar-connection:${employeeId}` : null, () => fetchConnection(employeeId!));

  const disconnectMutation = useMutation({
    mutationFn: disconnectGoogleCalendar,
    onSuccess: async () => {
      if (employeeId) {
        clearConnection(employeeId);
        await fetchConnection(employeeId);
      }
      toast.success(SETTINGS_COPY.calendar.disconnected);
    },
    onError: (cause) => {
      logger.captureException(cause, { action: "disconnectGoogleCalendar" });
      toast.error(SETTINGS_COPY.calendar.disconnectError);
    },
  });

  /*
   * El callback vuelve con `?calendario=` diciendo cómo fue. Se avisa una sola
   * vez y se limpia la URL: si se quedara, recargar repetiría el mensaje, y
   * compartir el enlace se lo mostraría a quien lo abriera.
   */
  const announcedOutcome = useRef<string | null>(null);
  const outcome = searchParams.get(OUTCOME_PARAM);

  useEffect(() => {
    if (!outcome || announcedOutcome.current === outcome) {
      return;
    }

    announcedOutcome.current = outcome;

    if (outcome === "conectado") {
      toast.success(SETTINGS_COPY.calendar.connectedToast);
    } else if (outcome === "cancelado") {
      toast.info(SETTINGS_COPY.calendar.cancelledToast);
    } else {
      toast.error(SETTINGS_COPY.calendar.errorToast);
    }

    router.replace("/settings/usuario");
  }, [outcome, router]);

  const connect = useCallback(() => {
    /*
     * Navegación del navegador y no `router.push`: el destino sale de la
     * aplicación hacia Google, y el enrutador de Next solo entiende rutas
     * propias.
     */
    window.location.href = "/api/google-calendar/connect";
  }, []);

  return {
    connection: entry?.data?.connection ?? null,
    connect,
    disconnect: disconnectMutation.mutate,
    disconnecting: disconnectMutation.isPending,
    loading: Boolean(employeeId && !entry?.data && !entry?.error),
  };
}
