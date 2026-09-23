import { useMemo } from "react";

import { SETTINGS_COPY } from "@/copy/settings-copy";
import { buildCareReminderMessage } from "../../../../supabase/functions/_shared/care-reminder-message";

const REMINDER_HOUR_OPTIONS = [1, 2, 6, 12, 24, 48];

const PREVIEW_TIMEZONE = "Europe/Madrid";
const PREVIEW_CLINIC = "Clínica Thalia";

type Props = {
  selectedHour: number;
  onSelectHour: (hour: number) => void;
  confirmationEnabled: boolean;
};

export default function SettingsWhatsAppReminderFields({
  selectedHour,
  onSelectHour,
  confirmationEnabled,
}: Props) {
  const previewMessage = useMemo(() => {
    const sentAt = new Date();
    const appointmentStartsAt = new Date(sentAt);
    appointmentStartsAt.setDate(appointmentStartsAt.getDate() + 1);
    appointmentStartsAt.setHours(17, 0, 0, 0);

    return buildCareReminderMessage({
      clinicName: PREVIEW_CLINIC,
      appointmentStartsAt,
      sentAt,
      timezone: PREVIEW_TIMEZONE,
      confirmationUrl: confirmationEnabled
        ? "https://app.thalia.es/cita/ejemplo"
        : null,
    });
  }, [confirmationEnabled]);

  return (
    <>
      <div className="flex flex-col gap-2">
        <p id="reminder-hour-label" className="text-sm font-medium text-ink">
          {SETTINGS_COPY.whatsapp.reminderHoursLabel}
        </p>
        <div
          role="radiogroup"
          aria-labelledby="reminder-hour-label"
          className="flex flex-wrap gap-2"
        >
          {REMINDER_HOUR_OPTIONS.map((hour) => {
            const selected = selectedHour === hour;

            return (
              <button
                key={hour}
                type="button"
                role="radio"
                aria-checked={selected}
                onClick={() => onSelectHour(hour)}
                className={`rounded-full px-3 py-1 text-sm font-medium transition-colors ${
                  selected
                    ? "bg-primary text-on-primary"
                    : "bg-surface text-ink-secondary border border-border hover:bg-canvas"
                }`}
              >
                {`${hour}h antes`}
              </button>
            );
          })}
        </div>
        <p className="text-xs text-ink-muted">
          {SETTINGS_COPY.whatsapp.reminderHoursHint}
        </p>
      </div>

      <div className="flex flex-col gap-2">
        <p className="text-sm font-medium text-ink">
          {SETTINGS_COPY.whatsapp.templateLabel}
        </p>
        <p
          data-testid="whatsapp-reminder-preview"
          className="rounded-xl border border-border-subtle bg-surface px-4 py-3 text-sm text-ink whitespace-pre-wrap"
        >
          {previewMessage}
        </p>
        <p className="text-xs text-ink-muted">
          {SETTINGS_COPY.whatsapp.templateHint}
        </p>
      </div>
    </>
  );
}
