export const EMPLOYEE_STATUS_COPY = {
  deactivate: {
    title: "Desactivar empleado",
    description: (name: string) =>
      `¿Desactivar a ${name}? No podrá ser asignado a nuevas citas.`,
    confirm: "Desactivar",
    saving: "Desactivando...",
    success: "Empleado desactivado correctamente.",
    error: "No se pudo desactivar el empleado.",
  },
  activate: {
    title: "Activar empleado",
    description: (name: string) =>
      `¿Activar a ${name}? Volverá a estar disponible para citas.`,
    confirm: "Activar",
    saving: "Activando...",
    success: "Empleado activado correctamente.",
    error: "No se pudo activar el empleado.",
  },
  cancel: "Cancelar",
} as const;
