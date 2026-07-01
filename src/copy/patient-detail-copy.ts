export const PATIENT_DETAIL_COPY = {
  back: "Volver a pacientes",
  sections: {
    general: "Información general",
    history: "Historial de citas",
  },
  fields: {
    dni: "DNI",
    birthDate: "Fecha de nacimiento",
    phone: "Teléfono",
    email: "Email",
    address: "Dirección",
    notes: "Notas",
  },
  history: {
    caption: "Citas de este paciente",
    columns: {
      date: "Fecha",
      time: "Horario",
      professional: "Profesional",
      status: "Estado",
    },
    empty: "No hay citas registradas para este paciente.",
  },
  actions: {
    edit: "Editar paciente",
  },
  errors: {
    load: "No se pudo cargar el paciente.",
    history: "No se pudo cargar el historial de citas.",
  },
} as const;
