export const PATIENT_DETAIL_COPY = {
  back: "Volver a pacientes",
  breadcrumbRoot: "Pacientes",
  sections: {
    general: "Información personal",
    history: "Historial de citas",
    timeline: "Línea de tiempo",
  },
  fields: {
    dni: "DNI",
    birthDate: "Fecha de nacimiento",
    phone: "Teléfono",
    email: "Email",
    address: "Dirección",
    notes: "Notas",
  },
  badges: {
    active: "Paciente activa",
    noAllergies: "Sin alergias conocidas",
    vip: "VIP",
  },
  stats: {
    lastAppointment: "Última cita",
    currentTreatment: "Tratamiento actual",
    nextAppointment: "Próxima cita",
    totalAppointments: "Total citas",
    empty: "—",
  },
  tabs: {
    summary: "Resumen",
    clinicalHistory: "Historial clínico",
    treatments: "Tratamientos",
    appointments: "Citas",
    gallery: "Galería",
    finances: "Finanzas",
    documents: "Documentos",
    notes: "Notas",
  },
  clinicalNotes: {
    title: "Notas clínicas",
    empty: "No hay notas clínicas registradas todavía.",
  },
  treatmentsTab: {
    treatment: "Tratamiento",
    timesUsed: "Veces usado",
    empty: "Este paciente no tiene tratamientos registrados.",
  },
  comingSoon: {
    finances: "Las finanzas del paciente estarán disponibles próximamente.",
    documents: "Los documentos del paciente estarán disponibles próximamente.",
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
    call: "Llamar",
    email: "Enviar email",
    createAppointment: "Crear cita",
  },
  moreActions: "Más acciones",
  errors: {
    load: "No se pudo cargar el paciente.",
    notFound: "Paciente no encontrado.",
    history: "No se pudo cargar el historial de citas.",
  },
} as const;
