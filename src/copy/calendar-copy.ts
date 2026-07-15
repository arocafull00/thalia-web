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
    viewDay: "Día",
    viewWeek: "Semana",
    viewMonth: "Mes",
    filters: "Filtros",
    filterEmployees: "Filtrar profesional",
    loading: (date: string) => `Cargando citas de ${date}...`,
  },
  event: {
    defaultPatient: "Paciente",
    defaultTreatment: "Cita",
    loadError: "No se pudieron cargar las citas del calendario.",
  },
  month: {
    weekdays: ["L", "M", "X", "J", "V", "S", "D"],
  },
  agenda: {
    empty: "No hay citas este día",
  },
  mobileMonth: {
    appointmentsTitle: (day: string) => `Citas del ${day}`,
    viewDay: "Ver día",
    empty: "No hay citas aún",
  },
} as const;
