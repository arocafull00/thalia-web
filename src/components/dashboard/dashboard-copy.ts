export const DASHBOARD_COPY = {
  welcome: (name: string) => `Hola, ${name}`,
  day: {
    label: "Día en curso",
    total: (n: number) => (n === 1 ? "1 cita" : `${n} citas`),
    progressLabel: (parts: string[], total: number) =>
      `De ${total} citas hoy: ${parts.join(", ")}`,
  },
  current: {
    inProgress: "En curso",
    next: "Siguiente",
    endsAt: (time: string) => `termina ${time}`,
    /* Nada cierra las citas por sí solo, así que una sin marcar se queda en
       curso indefinidamente. Esto lo dice sin cerrarla por nadie: completar una
       cita descuenta inventario y crea un ingreso, y eso lo decide una persona. */
    overdueEndedAt: (time: string) => `debía terminar ${time}`,
    overdueBy: (duration: string) => `${duration} de más`,
    overdueTitle:
      "Lleva abierta más de lo previsto. Ciérrala si ya ha terminado.",
    count: (n: number) => (n === 1 ? "1 cita" : `${n} citas`),
    complete: "Completar cita",
    view: "Ver cita",
    /* Jornada terminada y día sin citas se distinguen: a las nueve de la mañana
       lo segundo suele ser un error de agenda, no una mañana tranquila. */
    dayOver: "Jornada terminada. No queda ninguna cita por atender hoy.",
    noAppointments: "Hoy no hay ninguna cita en la agenda.",
    statusUpdated: "Cita completada.",
  },
  agenda: {
    title: "Agenda de hoy",
    viewCalendar: "Ver la agenda completa",
    /* El ingreso solo existe al completar la cita: el resto es previsión, y
       rotularlo evita afirmar un dinero que no está en finanzas. */
    earned: "ingresado",
    expected: "previsto",
    empty: "No hay citas programadas para hoy.",
    loadError: "No se pudo cargar el dashboard.",
  },
  actions: {
    newAppointment: "Nueva cita",
    newAppointmentLabel: "Nueva cita",
  },
  fallbackName: "de nuevo",
} as const;
