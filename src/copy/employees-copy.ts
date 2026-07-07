export const EMPLOYEES_COPY = {
  page: {
    title: "Personal",
    subtitle: (count: number) => `${count} profesionales registrados`,
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
  roles: {
    all: "Todos",
    admin: "Admin",
    reception: "Recepción",
    doctor: "Doctor",
    auxiliary: "Auxiliar",
  },
} as const;
