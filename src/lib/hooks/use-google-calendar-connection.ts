"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useRef } from "react";
import { toast } from "sonner";

import { SETTINGS_COPY } from "@/copy/settings-copy";
import {
  disconnectGoogleCalendar,
  getGoogleCalendarConnection,
} from "@/dal/google-calendar.dal";
import { logger } from "@/lib/logger";
import { useAuthStore } from "@/stores/auth-store";

const OUTCOME_PARAM = "calendario";

function connectionQueryKey(employeeId: string | undefined) {
  return ["google-calendar-connection", employeeId] as const;
}

export function useGoogleCalendarConnection() {
  const profile = useAuthStore((state) => state.profile);
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();

  const employeeId = profile?.id;

  /*
   * Con React Query y no con `useState` más `useEffect`: cargar en un efecto
   * obliga a llamar a `setState` dentro de él, que es justo lo que el lint del
   * proyecto prohíbe —y con razón, porque encadena renderizados—.
   */
  const connectionQuery = useQuery({
    queryKey: connectionQueryKey(employeeId),
    queryFn: () => getGoogleCalendarConnection(employeeId as string),
    enabled: Boolean(employeeId),
  });

  const disconnectMutation = useMutation({
    mutationFn: disconnectGoogleCalendar,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: connectionQueryKey(employeeId),
      });
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
    connection: connectionQuery.data ?? null,
    connect,
    disconnect: disconnectMutation.mutate,
    disconnecting: disconnectMutation.isPending,
    loading: connectionQuery.isPending && Boolean(employeeId),
  };
}
