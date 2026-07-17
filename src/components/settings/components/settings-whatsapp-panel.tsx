"use client";

import { MessageCircle, Save } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { SETTINGS_COPY } from "@/copy/settings-copy";
import { useWhatsAppSettings } from "@/lib/hooks/use-whatsapp-settings";

const REMINDER_HOUR_OPTIONS = [1, 2, 6, 12, 24, 48];

export default function SettingsWhatsAppPanel() {
  const { form, setForm, handleSave, loading, saving, toggleHour } =
    useWhatsAppSettings();

  if (loading) {
    return (
      <section aria-labelledby="settings-whatsapp-heading">
        <h2
          id="settings-whatsapp-heading"
          className="border-b border-border-subtle pb-4 text-lg font-medium text-ink"
        >
          {SETTINGS_COPY.whatsapp.sectionTitle}
        </h2>
        <div className="mt-4 h-40 animate-pulse rounded-xl bg-surface" />
      </section>
    );
  }

  return (
    <section aria-labelledby="settings-whatsapp-heading">
      <h2
        id="settings-whatsapp-heading"
        className="border-b border-border-subtle pb-4 text-lg font-medium text-ink"
      >
        {SETTINGS_COPY.whatsapp.sectionTitle}
      </h2>

      <div className="mt-4 flex flex-col gap-6">
        <div className="flex items-center justify-between gap-4 rounded-xl bg-surface p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-subtle text-primary">
              <MessageCircle className="h-4 w-4" aria-hidden="true" />
            </div>
            <div>
              <p className="text-sm font-medium text-ink">
                {SETTINGS_COPY.whatsapp.enableLabel}
              </p>
              <p className="text-xs text-ink-muted">
                {SETTINGS_COPY.whatsapp.enableHint}
              </p>
            </div>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={form.enabled}
            onClick={() =>
              setForm((prev) => ({ ...prev, enabled: !prev.enabled }))
            }
            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ${
              form.enabled ? "bg-primary" : "bg-border"
            }`}
          >
            <span
              className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow-lg transition-transform ${
                form.enabled ? "translate-x-5" : "translate-x-0"
              }`}
            />
          </button>
        </div>

        {form.enabled ? (
          <>
            <div className="flex flex-col gap-2">
              <label
                htmlFor="whatsapp-phone-id"
                className="text-sm font-medium text-ink"
              >
                {SETTINGS_COPY.whatsapp.phoneNumberIdLabel}
              </label>
              <Input
                id="whatsapp-phone-id"
                type="text"
                placeholder={SETTINGS_COPY.whatsapp.phoneNumberIdPlaceholder}
                value={form.phoneNumberId}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    phoneNumberId: e.target.value,
                  }))
                }
              />
              <p className="text-xs text-ink-muted">
                {SETTINGS_COPY.whatsapp.phoneNumberIdHint}
              </p>
            </div>

            <div className="flex flex-col gap-2">
              <p className="text-sm font-medium text-ink">
                {SETTINGS_COPY.whatsapp.reminderHoursLabel}
              </p>
              <div className="flex flex-wrap gap-2">
                {REMINDER_HOUR_OPTIONS.map((hour) => (
                  <button
                    key={hour}
                    type="button"
                    onClick={() => toggleHour(hour)}
                    className={`rounded-full px-3 py-1 text-sm font-medium transition-colors ${
                      form.reminderHours.includes(hour)
                        ? "bg-primary text-on-primary"
                        : "bg-surface text-ink-secondary border border-border hover:bg-canvas"
                    }`}
                  >
                    {hour === 1 ? "1h antes" : `${hour}h antes`}
                  </button>
                ))}
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
                value={form.messageTemplate}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    messageTemplate: e.target.value,
                  }))
                }
              />
              <p className="text-xs text-ink-muted">
                {SETTINGS_COPY.whatsapp.templateHint}
              </p>
            </div>
          </>
        ) : null}

        <div className="flex justify-end">
          <Button
            type="button"
            disabled={saving}
            onClick={() => void handleSave()}
            className="gap-2"
          >
            <Save className="h-4 w-4" aria-hidden="true" />
            {saving
              ? SETTINGS_COPY.whatsapp.savingLabel
              : SETTINGS_COPY.whatsapp.saveLabel}
          </Button>
        </div>
      </div>
    </section>
  );
}
