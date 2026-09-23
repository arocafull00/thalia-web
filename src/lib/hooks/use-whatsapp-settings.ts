"use client";

import { useCallback, useEffect, useState, type Dispatch, type SetStateAction } from "react";
import { toast } from "sonner";

import { SETTINGS_COPY } from "@/copy/settings-copy";
import { useActiveClinic } from "@/lib/hooks/use-active-clinic";
import { useRevalidateOnEntry } from "@/lib/hooks/use-revalidate-on-entry";
import { useWhatsAppSettingsStore } from "@/stores/whatsapp-settings-store";

export type WhatsAppSettingsForm = {
  enabled: boolean;
  reminderHours: number[];
  phoneNumberId: string;
  messageTemplate: string;
  confirmationEnabled: boolean;
};

export const DEFAULT_REMINDER_HOUR = 24;

const DEFAULT_TEMPLATE =
  "Hola {paciente}, te recordamos tu cita en {clinica} el {fecha} a las {hora} con {profesional}.";

/** Sin {enlace} el recordatorio llega sin botón y el paciente no puede confirmar. */
export const CONFIRMATION_LINK_PLACEHOLDER = "{enlace}";

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
    messageTemplate: DEFAULT_TEMPLATE,
    confirmationEnabled: false,
  };
  const cachedForm: WhatsAppSettingsForm = entry?.data ? {
    enabled: entry.data.reminder_enabled,
    reminderHours: entry.data.reminder_hours,
    phoneNumberId: entry.data.phone_number_id ?? "",
    messageTemplate: entry.data.message_template,
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

  // Una fila antigua puede traer varios valores guardados; se muestra
  // seleccionado el más lejano a la cita, que es el que ya venía por defecto.
  const selectedHour = form.reminderHours.length
    ? Math.max(...form.reminderHours)
    : DEFAULT_REMINDER_HOUR;

  const reminderTemplateMissingLink =
    form.confirmationEnabled &&
    !form.messageTemplate.includes(CONFIRMATION_LINK_PLACEHOLDER);

  const handleSave = async () => {
    if (!clinicId) return;

    // Guardar con la confirmación activada pero sin {enlace} dejaría el
    // servicio encendido y mudo: el paciente recibiría el recordatorio de
    // siempre, sin forma de confirmar, y la clínica esperando una respuesta.
    if (reminderTemplateMissingLink) {
      toast.error(SETTINGS_COPY.whatsapp.reminderTemplateMissingLink);
      return;
    }

    try {
      await saveSettings(clinicId, {
        reminder_enabled: form.enabled,
        reminder_hours: [selectedHour],
        phone_number_id: form.phoneNumberId.trim() || null,
        message_template: form.messageTemplate.trim() || DEFAULT_TEMPLATE,
        confirmation_enabled: form.confirmationEnabled,
      });
      setDraft(null);
      toast.success("Configuración de WhatsApp guardada.");
    } catch {
      toast.error("No se pudo guardar la configuración.");
    }
  };

  /*
   * Un único aviso por cita. La columna sigue siendo `INT[]` —así el envío no
   * cambia y se puede volver a varios sin migración— pero desde la interfaz
   * solo se elige uno: cada momento extra multiplica el coste de mensajería sin
   * que la clínica lo perciba.
   */
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
    reminderTemplateMissingLink,
  };
}
