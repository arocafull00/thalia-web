export const APPOINTMENTS_COPY = {
  page: {
    title: "Citas",
    empty: "No hay citas programadas.",
    loadError: "No se pudieron cargar las citas.",
    refresh: "Recargar citas",
    refreshing: "Recargando citas",
  },
  filters: {
    status: "Estado de la cita",
    employee: "Profesional",
    dateFrom: "Desde",
    dateTo: "Hasta",
    all: "Todos",
    allStatuses: "Todos los estados",
    search: "Buscar paciente, tratamiento o teléfono",
    searchClear: "Limpiar búsqueda",
    searchEmployee: "Buscar profesional",
    scheduled: "Programada",
    confirmed: "Confirmada",
    inProgress: "En sala",
    completed: "Completada",
    cancelled: "Cancelada",
    noShow: "No asistió",
  },
  filterLabels: {
    search: "Buscar cita",
    employee: "Profesional",
    dateRange: "Rango de fechas",
    status: "Estado",
  },
  list: {
    actions: {
      label: "Acciones de la cita",
      view: "Ver detalle",
      edit: "Editar cita",
      delete: "Eliminar cita",
    },
    columns: {
      actions: "Acciones",
    },
  },
} as const;
