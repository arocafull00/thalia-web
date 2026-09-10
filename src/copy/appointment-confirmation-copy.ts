export const APPOINTMENT_CONFIRMATION_COPY = {
  page: {
    title: "Confirmación de cita",
    description: "Confirma tu cita en un toque.",
  },
  withProfessional: (name: string) => `con ${name}`,
  /** Si el nombre no llega, antes «con tu profesional» que «con undefined». */
  fallbackProfessional: "tu profesional",
  labels: {
    date: "Fecha",
    time: "Hora",
    professional: "Profesional",
  },
  actions: {
    confirm: "Confirmar cita",
    confirming: "Confirmando…",
    retry: "Reintentar",
  },
  states: {
    confirmable: {
      title: "¿Confirmas tu cita?",
      body: "Pulsa el botón 'Confirmar cita' para confirmar a la clínica tu asistencia.",
    },
    justConfirmed: {
      title: "¡Cita confirmada!",
      body: "Gracias. Tu clínica ya lo sabe, no tienes que hacer nada más.",
    },
    already_confirmed: {
      title: "Tu cita ya está confirmada",
      body: "No hace falta que hagas nada más.",
    },
    cancelled: {
      title: "Esta cita fue cancelada",
      body: "Si crees que es un error, llama a tu clínica.",
    },
    past: {
      title: "Esta cita ya ha pasado",
      body: "Ya no se puede confirmar.",
    },
    expired: {
      title: "El enlace ha caducado",
      body: "Llama a tu clínica para confirmar tu cita.",
    },
    closed: {
      title: "Esta cita ya no admite cambios",
      body: "Si necesitas algo, llama a tu clínica.",
    },
    invalid: {
      title: "Enlace no válido",
      body: "Puede que el enlace esté incompleto o que ya no esté disponible. Llama a tu clínica si necesitas confirmar tu cita.",
    },
  },
  error: "No se ha podido confirmar. Inténtalo de nuevo en unos segundos.",
  callClinic: (phone: string) => `Llamar (${phone})`,
} as const;
