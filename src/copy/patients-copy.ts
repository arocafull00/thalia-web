export const PATIENTS_COPY = {
  page: {
    title: "Pacientes",
    subtitle: (count: number) => `${count} pacientes registrados`,
    empty: "Todavía no hay pacientes registrados.",
    loadError: "No se pudieron cargar los pacientes.",
  },
  filters: {
    status: "Estado del paciente",
    all: "Todos",
    active: "Activos",
    inactive: "Inactivos",
  },
} as const;
