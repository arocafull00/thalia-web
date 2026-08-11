export const PATIENTS_COPY = {
  page: {
    title: "Pacientes",
    empty: "Todavía no hay pacientes registrados.",
    loadError: "No se pudieron cargar los pacientes.",
    refresh: "Recargar pacientes",
    refreshing: "Recargando pacientes",
  },
  filters: {
    marketing: "Consentimiento de comunicaciones",
    all: "Todas",
    granted: "Activas",
    denied: "No activas",
  },
  filterLabels: {
    search: "Buscar paciente",
    marketing: "Comunicaciones",
  },
  list: {
    actions: {
      label: "Acciones del paciente",
      edit: "Editar paciente",
      view: "Ver detalle",
    },
    columns: {
      patient: "Paciente",
      phone: "Teléfono",
      email: "Email",
      marketingOptIn: "Comunicaciones",
      actions: "Acciones",
    },
    noPhone: "Sin teléfono",
    noEmail: "—",
  },
  marketingOptIn: {
    granted: "Activas",
    denied: "No activas",
  },
} as const;
