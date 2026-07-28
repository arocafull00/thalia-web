export const EMPLOYEE_EDIT_COPY = {
  title: "Editar empleado",
  description: "Actualiza los datos del profesional.",
  fields: {
    fullName: "Nombre completo",
    role: "Rol",
    specialty: "Especialidad",
    phone: "Teléfono",
    color: "Color distintivo",
    requiredMark: "*",
  },
  color: {
    custom: "Personalizado",
    remove: "Quitar",
  },
  roles: {
    admin: "Admin",
    reception: "Recepción",
    doctor: "Doctor",
    auxiliary: "Auxiliar",
  },
  actions: {
    cancel: "Cancelar",
    save: "Guardar cambios",
    saving: "Guardando...",
  },
  success: "Empleado actualizado correctamente.",
  error: "No se pudo actualizar el empleado.",
} as const;

export const EMPLOYEE_COLOR_PRESETS = [
  "#6366f1",
  "#8b5cf6",
  "#ec4899",
  "#f43f5e",
  "#f97316",
  "#eab308",
  "#22c55e",
  "#14b8a6",
  "#0ea5e9",
  "#64748b",
] as const;
