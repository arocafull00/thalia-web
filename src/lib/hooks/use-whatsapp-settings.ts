"use client";

import { useCallback, useEffect, useState, type Dispatch, type SetStateAction } from "react";
import { toast } from "sonner";

import { useActiveClinic } from "@/lib/hooks/use-active-clinic";
import { useRevalidateOnEntry } from "@/lib/hooks/use-revalidate-on-entry";
import { useWhatsAppSettingsStore } from "@/stores/whatsapp-settings-store";
import { CARE_REMINDER_TEMPLATE_DB_VALUE } from "../../../supabase/functions/_shared/care-reminder-message";

export type WhatsAppSettingsForm = {
  enabled: boolean;
  reminderHours: number[];
  phoneNumberId: string;
  confirmationEnabled: boolean;
};

export const DEFAULT_REMINDER_HOUR = 24;

export function useWhatsAppSettings() {
  const { clinicId } = useActiveClinic();
  const entry = useWhatsAppSettingsStore((state) => clinicId ? state.byClinicId[clinicId] : undefined);
  const saving = useWhatsAppSettingsStore((state) => state.saving);
  const fetchSettings = useWhatsAppSettingsStore((state) => state.fetchSettings);
  const saveSettings = useWhatsAppSettingsStore((state) => state.saveSettings);
  useRevalidateOnEntry(clinicId ? `whatsapp-settings:${clinicId}` : null, () => fetchSettings(clinicId!));
  useEffect(() => {
    if (entry?.error) toast.error("No se pudo cargar la configuración de WhatsApp.");
  }, [entry?.error]);

  const defaultForm: WhatsAppSettingsForm = {
    enabled: false,
    reminderHours: [DEFAULT_REMINDER_HOUR],
    phoneNumberId: "",
    confirmationEnabled: false,
  };
  const cachedForm: WhatsAppSettingsForm = entry?.data ? {
    enabled: entry.data.reminder_enabled,
    reminderHours: entry.data.reminder_hours,
    phoneNumberId: entry.data.phone_number_id ?? "",
    confirmationEnabled: entry.data.confirmation_enabled,
  } : defaultForm;
  const [draft, setDraft] = useState<{ clinicId: string; form: WhatsAppSettingsForm } | null>(null);
  const form = draft?.clinicId === clinicId ? draft.form : cachedForm;
  const setForm: Dispatch<SetStateAction<WhatsAppSettingsForm>> = useCallback((next) => {
    setDraft((current) => {
      const previous = current?.clinicId === clinicId ? current.form : cachedForm;
      return { clinicId: clinicId ?? "", form: typeof next === "function" ? next(previous) : next };
    });
  }, [cachedForm, clinicId]);

  const selectedHour = form.reminderHours.length
    ? Math.max(...form.reminderHours)
    : DEFAULT_REMINDER_HOUR;

  const handleSave = async () => {
    if (!clinicId) return;

    try {
      await saveSettings(clinicId, {
        reminder_enabled: form.enabled,
        reminder_hours: [selectedHour],
        phone_number_id: form.phoneNumberId.trim() || null,
        message_template: CARE_REMINDER_TEMPLATE_DB_VALUE,
        confirmation_enabled: form.confirmationEnabled,
      });
      setDraft(null);
      toast.success("Configuración de WhatsApp guardada.");
    } catch {
      toast.error("No se pudo guardar la configuración.");
    }
  };

  const selectHour = (hour: number) => {
    setForm((prev) => ({ ...prev, reminderHours: [hour] }));
  };

  return {
    form,
    setForm,
    handleSave,
    loading: Boolean(clinicId && !entry?.data && !entry?.error),
    saving,
    selectHour,
    selectedHour,
  };
}
