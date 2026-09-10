"use client";

import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";

import { SETTINGS_COPY } from "@/copy/settings-copy";
import {
  getClinicReminderSettings,
  updateClinicReminderSettings,
} from "@/dal/appointment-reminders.dal";
import { useActiveClinic } from "@/lib/hooks/use-active-clinic";

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
  const [loaded, setLoaded] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<WhatsAppSettingsForm>({
    enabled: false,
    reminderHours: [DEFAULT_REMINDER_HOUR],
    phoneNumberId: "",
    messageTemplate: DEFAULT_TEMPLATE,
    confirmationEnabled: false,
  });
  const fetchedForRef = useRef<string | null>(null);

  useEffect(() => {
    if (!clinicId || fetchedForRef.current === clinicId) return;

    fetchedForRef.current = clinicId;
    getClinicReminderSettings(clinicId)
      .then((data) => {
        setForm({
          enabled: data.whatsapp_reminder_enabled,
          reminderHours: data.whatsapp_reminder_hours,
          phoneNumberId: data.whatsapp_phone_number_id ?? "",
          messageTemplate: data.whatsapp_message_template,
          confirmationEnabled: data.whatsapp_confirmation_enabled,
        });
        setLoaded(true);
      })
      .catch(() => {
        toast.error("No se pudo cargar la configuración de WhatsApp.");
        setLoaded(true);
      });
  }, [clinicId]);

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

    setSaving(true);
    try {
      await updateClinicReminderSettings(clinicId, {
        whatsapp_reminder_enabled: form.enabled,
        whatsapp_reminder_hours: [selectedHour],
        whatsapp_phone_number_id: form.phoneNumberId.trim() || null,
        whatsapp_message_template:
          form.messageTemplate.trim() || DEFAULT_TEMPLATE,
        whatsapp_confirmation_enabled: form.confirmationEnabled,
      });
      toast.success("Configuración de WhatsApp guardada.");
    } catch {
      toast.error("No se pudo guardar la configuración.");
    } finally {
      setSaving(false);
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
    loading: !loaded,
    saving,
    selectHour,
    selectedHour,
    reminderTemplateMissingLink,
  };
}
