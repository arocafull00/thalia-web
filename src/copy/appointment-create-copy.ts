export const APPOINTMENT_CREATE_COPY = {
  title: "Nueva cita",
  description: "Programa una cita con paciente, profesional y tratamiento.",
  fields: {
    patient: "Paciente",
    employee: "Profesional",
    startsAt: "Fecha y hora",
    treatments: "Tratamientos",
    notes: "Notas",
    requiredMark: "*",
    selectPlaceholder: "Seleccionar...",
    searchPatient: "Buscar paciente",
    searchEmployee: "Buscar profesional",
    searchTreatment: "Buscar tratamiento",
    noTreatments: "No hay tratamientos disponibles.",
  },
  actions: {
    cancel: "Cancelar",
    save: "Guardar",
    saving: "Guardando...",
  },
  validation: {
    patientRequired: "Selecciona un paciente.",
    employeeRequired: "Selecciona un profesional.",
    clinicRequired: "No hay clínica activa.",
  },
  success: "Cita creada correctamente.",
  error: "No se pudo crear la cita.",
} as const;
