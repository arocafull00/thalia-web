import { useCallback, useState } from "react";
import { toast } from "sonner";

import { EXTERNAL_APPOINTMENT_COPY } from "@/copy/external-appointment-copy";
import { formatDateTime, formatTime } from "@/lib/format";
import { useActiveClinicTimezone } from "@/lib/hooks/use-active-clinic";
import { useAppointmentsStore } from "@/stores/appointments-store";
import type {
  AppointmentWithRelations,
  ExternalAppointmentResponseResult,
} from "@/types/database.types";

type OverlapState = {
  appointment: AppointmentWithRelations;
  conflict: Extract<
    ExternalAppointmentResponseResult,
    { outcome: "overlap" }
  >["conflict"];
};

export function useExternalAppointmentResponse() {
  const timezone = useActiveClinicTimezone();
  const respondingId = useAppointmentsStore(
    (state) => state.respondingExternalId,
  );
  /*
   * Los diálogos de rechazo y solapamiento son de una cita cada vez, así que
   * para ellos basta saber si hay algo en curso. El listado sí necesita el id:
   * con un booleano compartido, responder a una cita dejaba inertes los botones
   * de todas las demás.
   */
  const isPending = respondingId !== null;
  const [rejectionAppointment, setRejectionAppointment] =
    useState<AppointmentWithRelations | null>(null);
  const [overlap, setOverlap] = useState<OverlapState | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const respond = useCallback(
    async (
      appointment: AppointmentWithRelations,
      decision: "accept" | "reject",
      allowOverlap: boolean,
    ) => {
      if (!appointment.updated_at) {
        toast.error(EXTERNAL_APPOINTMENT_COPY.toast.error);
        return;
      }

      setErrorMessage(null);

      try {
        const result = await useAppointmentsStore
          .getState()
          .respondToExternalAppointment({
            appointmentId: appointment.id,
            decision,
            allowOverlap,
            expectedUpdatedAt: appointment.updated_at,
          });

        if (result.outcome === "overlap") {
          setOverlap({ appointment, conflict: result.conflict });
          return;
        }

        setRejectionAppointment(null);
        setOverlap(null);
        toast.success(
          result.outcome === "accepted"
            ? EXTERNAL_APPOINTMENT_COPY.toast.accepted
            : EXTERNAL_APPOINTMENT_COPY.toast.rejected,
        );
      } catch (cause) {
        const message =
          cause instanceof Error
            ? cause.message
            : EXTERNAL_APPOINTMENT_COPY.toast.error;
        setErrorMessage(message);
        toast.error(message);
      }
    },
    [],
  );

  return {
    /** Id de la cita que se está respondiendo, o null. Para el listado. */
    respondingId,
    /** Si hay alguna respuesta en curso. Para los diálogos. */
    isPending,
    errorMessage,
    rejectionAppointment,
    overlap,
    overlapDescription: overlap
      ? EXTERNAL_APPOINTMENT_COPY.overlap.description(
          overlap.conflict.clinicName,
          `${formatDateTime(overlap.conflict.startsAt, timezone)}–${formatTime(overlap.conflict.endsAt, timezone)}`,
        )
      : "",
    accept: (appointment: AppointmentWithRelations) =>
      respond(appointment, "accept", false),
    requestReject: (appointment: AppointmentWithRelations) => {
      setErrorMessage(null);
      setRejectionAppointment(appointment);
    },
    closeReject: () => {
      if (!isPending) {
        setErrorMessage(null);
        setRejectionAppointment(null);
      }
    },
    confirmReject: () =>
      rejectionAppointment
        ? respond(rejectionAppointment, "reject", false)
        : Promise.resolve(),
    closeOverlap: () => {
      if (!isPending) {
        setErrorMessage(null);
        setOverlap(null);
      }
    },
    confirmOverlap: () =>
      overlap
        ? respond(overlap.appointment, "accept", true)
        : Promise.resolve(),
  };
}
