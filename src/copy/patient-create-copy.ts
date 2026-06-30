export const PATIENT_CREATE_COPY = {
  title: "Nuevo paciente",
  description: "Registra un paciente en la clínica.",
  fields: {
    fullName: "Nombre completo",
    phone: "Teléfono",
    email: "Email",
    dni: "DNI",
    birthDate: "Fecha de nacimiento",
    address: "Dirección",
    notes: "Notas",
    requiredMark: "*",
  },
  actions: {
    cancel: "Cancelar",
    save: "Guardar",
    saving: "Guardando...",
  },
  validation: {
    fullNameRequired: "El nombre es obligatorio.",
    clinicRequired: "No hay clínica activa.",
  },
  success: "Paciente creado correctamente.",
  error: "No se pudo crear el paciente.",
} as const;
