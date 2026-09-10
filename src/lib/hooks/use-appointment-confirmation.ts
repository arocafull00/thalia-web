"use client";

import { useCallback, useState } from "react";

import { confirmAppointmentByToken } from "@/dal/appointment-confirmations.dal";
import { logger } from "@/lib/logger";
import type { AppointmentConfirmationView } from "@/types/database.types";

type Props = {
  token: string;
  initialView: AppointmentConfirmationView | null;
};

export function useAppointmentConfirmation({ token, initialView }: Props) {
  const [view, setView] = useState(initialView);
  const [confirming, setConfirming] = useState(false);
  const [failed, setFailed] = useState(false);
  /*
   * El servidor no distingue "acabas de confirmar" de "ya estaba confirmada":
   * ambas son `already_confirmed`, y así la función es idempotente de verdad.
   * La diferencia sólo importa para el mensaje, y aquí sí se sabe, porque el
   * estado previo a pulsar era `confirmable`.
   */
  const [justConfirmed, setJustConfirmed] = useState(false);

  const handleConfirm = useCallback(async () => {
    setConfirming(true);
    setFailed(false);

    try {
      const result = await confirmAppointmentByToken(token);

      if (result) {
        setView(result);
        setJustConfirmed(result.state === "already_confirmed");
      }
    } catch (cause) {
      logger.captureException(cause, {
        hook: "use-appointment-confirmation",
        action: "confirm",
      });
      setFailed(true);
    } finally {
      setConfirming(false);
    }
  }, [token]);

  return { view, confirming, failed, justConfirmed, handleConfirm };
}
