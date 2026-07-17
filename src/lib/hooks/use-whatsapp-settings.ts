"use client";

import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";

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
};

const DEFAULT_TEMPLATE =
  "Hola {paciente}, te recordamos tu cita en {clinica} el {fecha} a las {hora} con {profesional}.";

export function useWhatsAppSettings() {
  const { clinicId } = useActiveClinic();
  const [loaded, setLoaded] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<WhatsAppSettingsForm>({
    enabled: false,
    reminderHours: [24],
    phoneNumberId: "",
    messageTemplate: DEFAULT_TEMPLATE,
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
        });
        setLoaded(true);
      })
      .catch(() => {
        toast.error("No se pudo cargar la configuración de WhatsApp.");
        setLoaded(true);
      });
  }, [clinicId]);

  const handleSave = async () => {
    if (!clinicId) return;

    setSaving(true);
    try {
      await updateClinicReminderSettings(clinicId, {
        whatsapp_reminder_enabled: form.enabled,
        whatsapp_reminder_hours: form.reminderHours,
        whatsapp_phone_number_id: form.phoneNumberId.trim() || null,
        whatsapp_message_template:
          form.messageTemplate.trim() || DEFAULT_TEMPLATE,
      });
      toast.success("Configuración de WhatsApp guardada.");
    } catch {
      toast.error("No se pudo guardar la configuración.");
    } finally {
      setSaving(false);
    }
  };

  const toggleHour = (hour: number) => {
    setForm((prev) => ({
      ...prev,
      reminderHours: prev.reminderHours.includes(hour)
        ? prev.reminderHours.filter((h) => h !== hour)
        : [...prev.reminderHours, hour].sort((a, b) => b - a),
    }));
  };

  return { form, setForm, handleSave, loading: !loaded, saving, toggleHour };
}
