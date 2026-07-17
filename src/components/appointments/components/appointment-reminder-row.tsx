"use client";

import { MessageCircle, Send } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

import { Button } from "@/components/ui/button";
import { APPOINTMENT_DETAIL_COPY } from "@/copy/appointment-detail-copy";
import {
  getRemindersForAppointment,
  sendManualReminder,
} from "@/dal/appointment-reminders.dal";
import { useActiveClinic } from "@/lib/hooks/use-active-clinic";
import type { AppointmentReminder } from "@/types/database.types";

type AppointmentReminderRowProps = {
  appointmentId: string;
  reminderSent: boolean | null;
};

export default function AppointmentReminderRow({
  appointmentId,
  reminderSent,
}: AppointmentReminderRowProps) {
  const { clinicId } = useActiveClinic();
  const [reminders, setReminders] = useState<AppointmentReminder[]>([]);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    getRemindersForAppointment(appointmentId)
      .then((data) => setReminders(Array.isArray(data) ? data : []))
      .catch(() => {});
  }, [appointmentId]);

  const lastSent = reminders.find((r) => r.status === "sent");
  const hasSent = !!lastSent || !!reminderSent;

  const handleSendManual = async () => {
    if (!clinicId) return;

    setSending(true);
    try {
      await sendManualReminder(appointmentId, clinicId);
      toast.success(APPOINTMENT_DETAIL_COPY.reminderManualSuccess);
      const updated = await getRemindersForAppointment(appointmentId);
      setReminders(Array.isArray(updated) ? updated : []);
    } catch {
      toast.error(APPOINTMENT_DETAIL_COPY.reminderManualError);
    } finally {
      setSending(false);
    }
  };

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
            {APPOINTMENT_DETAIL_COPY.reminderScheduled}
          </p>
        )}
      </div>
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
    </div>
  );
}
