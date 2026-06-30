export const CALENDAR_COPY = {
  toolbar: {
    today: "Hoy",
    newAppointment: "Nueva cita",
    previousWeek: "Semana anterior",
    nextWeek: "Semana siguiente",
    loading: (date: string) => `Cargando citas de ${date}...`,
  },
  event: {
    defaultPatient: "Paciente",
    defaultTreatment: "Cita",
  },
} as const;
