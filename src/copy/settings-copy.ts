export const SETTINGS_COPY = {
  page: {
    title: "Ajustes",
    profileError: "No se pudo cargar el perfil.",
  },
  nav: {
    usuario: "Usuario",
    clinica: "Clínica",
  },
  actions: {
    call: "Llamar",
    email: "Enviar email",
  },
  moreActions: "Más acciones",
  menuSections: {
    clinic: "Clínica",
  },
  sections: {
    stats: "Resumen",
    statsEmpty: "No hay estadísticas disponibles.",
  },
  profile: {
    editProfile: "Editar perfil",
    adminBadge: "Administrador",
  },
  stats: {
    activeEmployees: "Empleados activos",
    pendingRequests: "Solicitudes pendientes",
    platformRole: "Rol en la plataforma",
    viewClinicRequests: "Ver solicitudes de clínica",
  },
  account: {
    sectionTitle: "Cuenta",
    changePassword: "Cambiar contraseña",
    changePasswordLoading: "Enviando...",
    changePasswordHint: "Te enviaremos un email para restablecerla",
    changePasswordError:
      "No se pudo enviar el email para cambiar la contraseña. Inténtalo de nuevo.",
    signOut: "Cerrar sesión",
    signOutLoading: "Cerrando sesión...",
    signOutHint: "Salir de la plataforma en este dispositivo",
  },
  clinic: {
    sectionTitle: "Datos de la clínica",
    hours: "Horario laboral",
    name: "Nombre",
    phone: "Teléfono",
    address: "Dirección",
    specialty: "Especialidad",
    noData: "Sin información",
  },
  management: {
    sectionTitle: "Gestión",
    team: "Equipo",
    teamDescription: "Invita y gestiona accesos",
    staff: "Personal",
    staffDescription: "Profesionales y horarios",
  },
  whatsapp: {
    sectionTitle: "Servicios de la clínica",
    enableLabel: "Activar recordatorios automáticos (WhatsApp)",
    enableHint: "Envía mensajes automáticos via WhatsApp antes de las citas",
    phoneNumberIdLabel: "Número de envío",
    phoneNumberIdPlaceholder: "Ej: +14155238886",
    phoneNumberIdHint:
      "Número de Twilio con prefijo internacional. En sandbox usa el número del sandbox de Twilio.",
    reminderHoursLabel: "Enviar recordatorio",
    reminderHoursHint: "Puedes seleccionar varios momentos",
    templateLabel: "Mensaje",
    templateHint:
      "Variables disponibles: {paciente}, {clinica}, {fecha}, {hora}, {profesional}",
    saveLabel: "Guardar",
    savingLabel: "Guardando...",
  },
} as const;
