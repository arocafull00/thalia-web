export const EMPLOYEE_INVITE_COPY = {
  title: "Invitar personal",
  description: "Envía una invitación para unirse al equipo de la clínica.",
  fields: {
    fullName: "Nombre completo",
    email: "Email",
    role: "Rol",
    specialty: "Especialidad",
    phone: "Teléfono",
    requiredMark: "*",
  },
  roles: {
    admin: "Admin",
    reception: "Recepción",
    doctor: "Doctor",
    auxiliary: "Auxiliar",
  },
  actions: {
    cancel: "Cancelar",
    save: "Enviar invitación",
    saving: "Enviando...",
  },
  validation: {
    fullNameRequired: "El nombre es obligatorio.",
    emailRequired: "El email es obligatorio.",
    emailInvalid: "Introduce un email válido.",
    clinicRequired: "No hay clínica activa.",
  },
  success: "Invitación enviada correctamente.",
  error: "No se pudo enviar la invitación.",
} as const;
