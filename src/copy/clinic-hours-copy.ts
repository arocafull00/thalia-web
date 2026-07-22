export const CLINIC_HOURS_COPY = {
  title: "Editar horario",
  description: "Configura el horario laboral de tu clínica.",
  sections: {
    hours: "Horario laboral",
  },
  fields: {
    openingTime: "Hora de apertura",
    closingTime: "Hora de cierre",
    openDays: "Días abiertos",
    timezone: "Zona horaria",
    atLeastOneDay: "Selecciona al menos un día",
    closingAfterOpening: "El cierre debe ser posterior a la apertura",
  },
  days: ["L", "M", "X", "J", "V", "S", "D"] as const,
  timezones: [
    { value: "Europe/Madrid", label: "Europe/Madrid (CET/CEST)" },
    { value: "Europe/London", label: "Europe/London (GMT/BST)" },
    { value: "Europe/Paris", label: "Europe/Paris (CET/CEST)" },
    { value: "America/New_York", label: "America/New_York (ET)" },
    { value: "America/Mexico_City", label: "America/Mexico_City (CT)" },
    { value: "America/Buenos_Aires", label: "America/Buenos_Aires (ART)" },
  ],
  actions: {
    cancel: "Cancelar",
    save: "Guardar cambios",
    saving: "Guardando...",
  },
  success: "Horario actualizado correctamente.",
  error: "No se pudo actualizar el horario.",
} as const;
