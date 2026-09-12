"use client";

import { MessageCircle, Send } from "lucide-react";

import { useAppointmentReminders } from "@/components/appointments/hooks/use-appointment-reminders";
import { Button } from "@/components/ui/button";
import { APPOINTMENT_DETAIL_COPY } from "@/copy/appointment-detail-copy";
import type { AppointmentStatus } from "@/types/database.types";

/**
 * Los únicos estados a los que `send-reminders` envía. La función filtra por
 * estos mismos, tanto en el barrido como en el envío manual, así que ofrecer el
 * botón fuera de aquí sería prometer algo que el servidor va a rechazar.
 */
const ESTADOS_CON_RECORDATORIO: AppointmentStatus[] = [
  "scheduled",
  "confirmed",
];

type AppointmentReminderRowProps = {
  appointmentId: string;
  reminderSent: boolean | null;
  status: AppointmentStatus | null;
};

export default function AppointmentReminderRow({
  appointmentId,
  reminderSent,
  status,
}: AppointmentReminderRowProps) {
  // Un estado nulo tampoco se envía: el `IN` de la consulta del servidor
  // tampoco casa con NULL, así que el botón prometería algo que no ocurre.
  const puedeEnviarse =
    status !== null && ESTADOS_CON_RECORDATORIO.includes(status);
  const { handleSendManual, hasSent, sending } = useAppointmentReminders(
    appointmentId,
    reminderSent,
  );

  return (
    <div className="flex items-center justify-between gap-4 py-3">
      <div>
        <p className="text-sm text-ink-secondary">
          {APPOINTMENT_DETAIL_COPY.reminder}
        </p>
        {hasSent ? (
          <p className="mt-0.5 flex items-center gap-1 text-xs text-success">
            <MessageCircle className="h-3 w-3" aria-hidden="true" />
            {APPOINTMENT_DETAIL_COPY.reminderSent}
          </p>
        ) : (
          <p className="mt-0.5 text-xs text-ink-muted">
            {puedeEnviarse
              ? APPOINTMENT_DETAIL_COPY.reminderScheduled
              : APPOINTMENT_DETAIL_COPY.reminderNotApplicable}
          </p>
        )}
      </div>
      {puedeEnviarse ? (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          disabled={sending}
          onClick={() => void handleSendManual()}
          className="h-8 gap-1.5 text-xs"
        >
          <Send className="h-3 w-3" aria-hidden="true" />
          {sending
            ? APPOINTMENT_DETAIL_COPY.reminderSending
            : APPOINTMENT_DETAIL_COPY.reminderSendManual}
        </Button>
      ) : null}
    </div>
  );
}
