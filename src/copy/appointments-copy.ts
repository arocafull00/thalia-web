export const APPOINTMENTS_COPY = {
  page: {
    title: "Citas",
    empty: "No hay citas programadas.",
    loadError: "No se pudieron cargar las citas.",
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
  panel: {
    countSingular: "1 cita",
    countPlural: "{count} citas",
  },
} as const;
