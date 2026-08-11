export const PATIENTS_COPY = {
  page: {
    title: "Pacientes",
    empty: "Todavía no hay pacientes registrados.",
    loadError: "No se pudieron cargar los pacientes.",
    refresh: "Recargar pacientes",
    refreshing: "Recargando pacientes",
  },
  filters: {
    status: "Estado del paciente",
    all: "Todos",
    active: "Activos",
    inactive: "Inactivos",
  },
  filterLabels: {
    search: "Buscar paciente",
    status: "Estado",
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
    granted: "Activo",
    denied: "No activo",
  },
} as const;
