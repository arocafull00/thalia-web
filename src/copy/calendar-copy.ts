export const CALENDAR_COPY = {
  filters: {
    all: "Todos",
    employee: "Profesional",
    searchEmployee: "Buscar profesional",
    view: "Vista",
  },
  toolbar: {
    today: "Hoy",
    newAppointment: "Nueva cita",
    previousWeek: "Semana anterior",
    nextWeek: "Semana siguiente",
    previousPeriod: "Período anterior",
    nextPeriod: "Período siguiente",
    viewWeek: "Semana",
    viewMonth: "Mes",
    filters: "Filtros",
    filterEmployees: "Filtrar profesional",
    loading: (date: string) => `Cargando citas de ${date}...`,
  },
  event: {
    defaultPatient: "Paciente",
    defaultTreatment: "Cita",
  },
} as const;
