export const DASHBOARD_COPY = {
  welcome: (name: string) => `Bienvenida, ${name}`,
  stats: {
    todayAppointments: "Citas hoy",
    confirmed: "Confirmadas",
  },
  agenda: {
    title: "Próximas citas",
    viewCalendar: "Ver calendario",
    empty: "No hay citas programadas para hoy.",
    loadError: "No se pudo cargar el dashboard.",
  },
  recentActivity: {
    title: "Actividad reciente",
    empty: "Sin actividad reciente.",
  },
  actions: {
    newAppointment: "Nueva cita",
    newAppointmentLabel: "Nueva cita",
  },
  fallbackName: "de nuevo",
} as const;
