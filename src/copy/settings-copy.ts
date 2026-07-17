export const SETTINGS_COPY = {
  page: {
    title: "Ajustes",
    profileError: "No se pudo cargar el perfil.",
  },
  tabs: {
    summary: "Resumen",
    account: "Cuenta",
    app: "Aplicación",
    whatsapp: "WhatsApp",
  },
  actions: {
    call: "Llamar",
    email: "Enviar email",
  },
  moreActions: "Más acciones",
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
  management: {
    sectionTitle: "Gestión",
    team: "Equipo",
    teamDescription: "Invita y gestiona accesos",
    staff: "Personal",
    staffDescription: "Profesionales y horarios",
  },
  whatsapp: {
    sectionTitle: "Recordatorios WhatsApp",
    enableLabel: "Activar recordatorios",
    enableHint: "Envía mensajes automáticos antes de las citas",
    phoneNumberIdLabel: "Número de envío (Twilio)",
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
