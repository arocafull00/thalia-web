export const EMPLOYEES_COPY = {
  page: {
    title: "Personal",
    empty: "Todavía no hay personal registrado.",
    loadError: "No se pudo cargar el personal.",
    permissions: "Permisos insuficientes.",
  },
  filters: {
    role: "Filtrar por rol",
    status: "Estado del empleado",
    all: "Todos",
    active: "Activos",
    inactive: "Inactivos",
  },
  filterLabels: {
    search: "Buscar empleado",
    role: "Rol",
    status: "Estado",
  },
  list: {
    actions: {
      label: "Acciones del empleado",
      view: "Ver detalle",
      edit: "Editar empleado",
      activate: "Activar empleado",
      deactivate: "Desactivar empleado",
    },
    columns: {
      actions: "Acciones",
    },
  },
  roles: {
    all: "Todos",
    admin: "Admin",
    reception: "Recepción",
    doctor: "Doctor",
    auxiliary: "Auxiliar",
  },
} as const;
