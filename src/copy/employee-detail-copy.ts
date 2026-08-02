export const EMPLOYEE_DETAIL_COPY = {
  back: "Volver al personal",
  breadcrumbRoot: "Personal",
  tabs: {
    summary: "Resumen",
    appointments: "Citas",
  },
  sections: {
    summary: "Resumen del profesional",
    history: "Historial de citas",
  },
  fields: {
    color: "Color asignado",
    memberSince: "En la clínica desde",
  },
  status: {
    active: "Activo",
    inactive: "Inactivo",
  },
  stats: {
    total: "Total citas",
    completed: "Completadas",
    upcoming: "Próximas",
    cancelled: "Canceladas / no show",
  },
  history: {
    caption: "Citas atendidas por este profesional",
    columns: {
      date: "Fecha",
      time: "Horario",
      patient: "Paciente",
      status: "Estado",
    },
    empty: "No hay citas registradas para este profesional.",
  },
  actions: {
    edit: "Editar empleado",
    call: "Llamar",
    deactivate: "Desactivar empleado",
    activate: "Activar empleado",
  },
  moreActions: "Más acciones",
  menuSections: {
    contact: "Contacto",
    status: "Estado del empleado",
  },
  errors: {
    load: "No se pudo cargar el empleado.",
    stats: "No se pudieron cargar las estadísticas.",
    history: "No se pudo cargar el historial de citas.",
    notFound: "Empleado no encontrado.",
    permissions: "Permisos insuficientes.",
  },
} as const;
