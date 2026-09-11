"use client";

import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

import { APPOINTMENT_DETAIL_COPY } from "@/copy/appointment-detail-copy";
import {
  firstSkipReason,
  getRemindersForAppointment,
  sendManualReminder,
} from "@/dal/appointment-reminders.dal";
import { useActiveClinic } from "@/lib/hooks/use-active-clinic";
import type { AppointmentReminder } from "@/types/database.types";

export function useAppointmentReminders(
  appointmentId: string,
  reminderSent: boolean | null,
) {
  const { clinicId } = useActiveClinic();
  const [reminders, setReminders] = useState<AppointmentReminder[]>([]);
  const [sending, setSending] = useState(false);

  const refreshReminders = useCallback(async () => {
    const data = await getRemindersForAppointment(appointmentId);
    setReminders(Array.isArray(data) ? data : []);
  }, [appointmentId]);

  useEffect(() => {
    void refreshReminders().catch(() => {});
  }, [refreshReminders]);

  const lastSent = reminders.find((reminder) => reminder.status === "sent");
  const hasSent = Boolean(lastSent) || Boolean(reminderSent);

  const handleSendManual = async () => {
    if (!clinicId) {
      return;
    }

    setSending(true);

    try {
      const summary = await sendManualReminder(appointmentId, clinicId);

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

      await refreshReminders();
    } catch {
      toast.error(APPOINTMENT_DETAIL_COPY.reminderManualError);
    } finally {
      setSending(false);
    }
  };

  return {
    handleSendManual,
    hasSent,
    sending,
  };
}
