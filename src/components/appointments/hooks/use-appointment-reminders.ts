"use client";

import { toast } from "sonner";

import { APPOINTMENT_DETAIL_COPY } from "@/copy/appointment-detail-copy";
import {
  firstSkipReason,
} from "@/dal/appointment-reminders.dal";
import { useActiveClinic } from "@/lib/hooks/use-active-clinic";
import { useRevalidateOnEntry } from "@/lib/hooks/use-revalidate-on-entry";
import { useAppointmentRemindersStore } from "@/stores/appointment-reminders-store";

export function useAppointmentReminders(
  appointmentId: string,
  reminderSent: boolean | null,
) {
  const { clinicId } = useActiveClinic();
  const reminders = useAppointmentRemindersStore((state) => state.byAppointmentId[appointmentId]?.data ?? []);
  const sending = useAppointmentRemindersStore((state) => state.sending);
  const fetchReminders = useAppointmentRemindersStore((state) => state.fetchReminders);
  const sendManual = useAppointmentRemindersStore((state) => state.sendManual);
  useRevalidateOnEntry(clinicId && appointmentId ? `appointment-reminders:${appointmentId}` : null, () => fetchReminders(appointmentId));

  const lastSent = reminders.find((reminder) => reminder.status === "sent");
  const hasSent = Boolean(lastSent) || Boolean(reminderSent);

  const handleSendManual = async () => {
    if (!clinicId) {
      return;
    }

    try {
      const summary = await sendManual(appointmentId, clinicId);

      if (summary?.sent) {
        toast.success(APPOINTMENT_DETAIL_COPY.reminderManualSuccess);
      } else if (summary?.failed) {
        toast.error(APPOINTMENT_DETAIL_COPY.reminderManualError);
      } else {
        const reason = firstSkipReason(summary) ?? "desconocido";
        toast.info(
          APPOINTMENT_DETAIL_COPY.reminderSkipped[
            reason as keyof typeof APPOINTMENT_DETAIL_COPY.reminderSkipped
          ] ?? APPOINTMENT_DETAIL_COPY.reminderSkipped.desconocido,
        );
      }

    } catch {
      toast.error(APPOINTMENT_DETAIL_COPY.reminderManualError);
    }
  };

  return {
    handleSendManual,
    hasSent,
    sending,
  };
}
