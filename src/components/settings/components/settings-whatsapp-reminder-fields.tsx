import { Notice } from "@/components/ui/primitives/notice";
import { Textarea } from "@/components/ui/textarea";
import { SETTINGS_COPY } from "@/copy/settings-copy";

const REMINDER_HOUR_OPTIONS = [1, 2, 6, 12, 24, 48];

type Props = {
  selectedHour: number;
  onSelectHour: (hour: number) => void;
  template: string;
  onTemplateChange: (value: string) => void;
  confirmationEnabled: boolean;
  missingLink: boolean;
};

export default function SettingsWhatsAppReminderFields({
  selectedHour,
  onSelectHour,
  template,
  onTemplateChange,
  confirmationEnabled,
  missingLink,
}: Props) {
  return (
    <>
      <div className="flex flex-col gap-2">
        <p id="reminder-hour-label" className="text-sm font-medium text-ink">
          {SETTINGS_COPY.whatsapp.reminderHoursLabel}
        </p>
        {/*
          Elección única: se envía un solo aviso por cita. Semántica de radio y
          no de casilla, porque marcar uno desmarca el anterior.
        */}
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
        <label
          htmlFor="whatsapp-template"
          className="text-sm font-medium text-ink"
        >
          {SETTINGS_COPY.whatsapp.templateLabel}
        </label>
        <Textarea
          id="whatsapp-template"
          rows={4}
          value={template}
          onChange={(e) => onTemplateChange(e.target.value)}
        />
        {missingLink ? (
          <Notice
            tone="danger"
            message={SETTINGS_COPY.whatsapp.reminderTemplateMissingLink}
          />
        ) : null}
        <p className="text-xs text-ink-muted">
          {confirmationEnabled
            ? SETTINGS_COPY.whatsapp.templateHintWithLink
            : SETTINGS_COPY.whatsapp.templateHint}
        </p>
      </div>
    </>
  );
}
