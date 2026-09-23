"use client";

import { CalendarCheck, MessageCircle, Save } from "lucide-react";

import SettingsWhatsAppReminderFields from "@/components/settings/components/settings-whatsapp-reminder-fields";
import SettingsWhatsAppToggle from "@/components/settings/components/settings-whatsapp-toggle";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SETTINGS_COPY } from "@/copy/settings-copy";
import { useWhatsAppSettings } from "@/lib/hooks/use-whatsapp-settings";

export default function SettingsWhatsAppPanel() {
  const {
    form,
    setForm,
    handleSave,
    loading,
    saving,
    selectHour,
    selectedHour,
  } = useWhatsAppSettings();

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
        <SettingsWhatsAppToggle
          icon={MessageCircle}
          label={SETTINGS_COPY.whatsapp.enableLabel}
          hint={SETTINGS_COPY.whatsapp.enableHint}
          checked={form.enabled}
          onToggle={() =>
            setForm((prev) => ({ ...prev, enabled: !prev.enabled }))
          }
        />

        {/*
          La confirmación viaja dentro del recordatorio, así que sin
          recordatorios no hay nada que confirmar: cuelga de él y no al lado.
        */}
        {form.enabled ? (
          <SettingsWhatsAppToggle
            icon={CalendarCheck}
            label={SETTINGS_COPY.whatsapp.confirmationEnableLabel}
            hint={SETTINGS_COPY.whatsapp.confirmationEnableHint}
            checked={form.confirmationEnabled}
            onToggle={() =>
              setForm((prev) => ({
                ...prev,
                confirmationEnabled: !prev.confirmationEnabled,
              }))
            }
          />
        ) : null}

        {form.enabled ? (
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
              value={form.phoneNumberId}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, phoneNumberId: e.target.value }))
              }
            />
          </div>
        ) : null}

        {form.enabled ? (
          <SettingsWhatsAppReminderFields
            selectedHour={selectedHour}
            onSelectHour={selectHour}
            confirmationEnabled={form.confirmationEnabled}
          />
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
