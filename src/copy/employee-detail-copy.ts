export const EMPLOYEE_DETAIL_COPY = {
  back: "Volver al personal",
  sections: {
    general: "Información general",
    stats: "Estadísticas",
    history: "Historial de citas",
  },
  fields: {
    role: "Rol",
    specialty: "Especialidad",
    phone: "Teléfono",
    color: "Color asignado",
    status: "Estado",
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
    deactivate: "Desactivar empleado",
    activate: "Activar empleado",
  },
  errors: {
    load: "No se pudo cargar el empleado.",
    stats: "No se pudieron cargar las estadísticas.",
    history: "No se pudo cargar el historial de citas.",
    notFound: "Empleado no encontrado.",
    permissions: "Permisos insuficientes.",
  },
} as const;
