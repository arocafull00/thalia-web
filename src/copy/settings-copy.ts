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
    pendingRequests: "Invitaciones pendientes",
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
    changePasswordSuccess: "Revisa tu email para crear una nueva contraseña.",
    changePasswordNoEmail: "No hay un email asociado a esta cuenta.",
    changePasswordCooldown: (seconds: number) =>
      `Podrás reenviarlo en ${seconds}s`,
    changePasswordCooldownHint:
      "Ya te hemos enviado el email. Revisa tu bandeja y la carpeta de spam.",
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
    reminderHoursLabel: "Enviar recordatorio",
    reminderHoursHint: "Se envía un único aviso por cita",
    templateLabel: "Mensaje",
    templateHint:
      "Variables disponibles: {paciente}, {clinica}, {fecha}, {hora}, {profesional}",
    templateHintWithLink:
      "Variables disponibles: {paciente}, {clinica}, {fecha}, {hora}, {profesional} y {enlace}, el botón para confirmar",
    confirmationEnableLabel: "Pedir confirmación en el recordatorio",
    confirmationEnableHint:
      "Añade al recordatorio un enlace para que el paciente confirme la cita",
    reminderTemplateMissingLink:
      "Añade {enlace} al mensaje o el paciente no podrá confirmar.",
    saveLabel: "Guardar",
    savingLabel: "Guardando...",
  },
} as const;
