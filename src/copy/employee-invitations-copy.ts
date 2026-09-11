export const EMPLOYEE_INVITATIONS_COPY = {
  tabs: {
    staff: "Personal",
    invitations: "Invitaciones pendientes",
    ariaLabel: "Gestión de personal",
  },
  list: {
    columns: {
      email: "Email",
      role: "Rol invitado",
      sentAt: "Fecha de envío",
      expiresAt: "Caducidad",
      actions: "Acciones",
    },
    empty: "No hay invitaciones pendientes.",
    loadError: "No se pudieron cargar las invitaciones pendientes.",
    actionsLabel: "Acciones de la invitación",
  },
  actions: {
    edit: "Editar",
    reactivate: "Reactivar",
    cancel: "Cancelar invitación",
  },
  edit: {
    title: "Editar invitación",
    description:
      "Los cambios sustituirán el enlace actual por una invitación nueva.",
    save: "Guardar cambios",
    saving: "Guardando...",
    success: "Invitación actualizada correctamente.",
    error: "No se pudo actualizar la invitación.",
  },
  reactivate: {
    title: "Reactivar invitación",
    description: (email: string) =>
      `Se sustituirá la invitación de ${email} por otra válida durante 7 días.`,
    confirm: "Reactivar",
    pending: "Reactivando...",
    success: "Invitación reactivada durante 7 días.",
    error: "No se pudo reactivar la invitación.",
  },
  cancel: {
    title: "Cancelar invitación",
    description: (email: string) =>
      `La invitación de ${email} se eliminará y su enlace dejará de funcionar.`,
    confirm: "Cancelar invitación",
    pending: "Cancelando...",
    success: "Invitación cancelada correctamente.",
    error: "No se pudo cancelar la invitación.",
  },
  common: {
    dismiss: "Volver",
  },
} as const;
