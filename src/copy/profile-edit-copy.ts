export const PROFILE_EDIT_COPY = {
  title: "Editar perfil",
  description: "Actualiza tus datos personales y de contacto.",
  fields: {
    fullName: "Nombre completo",
    specialty: "Especialidad",
    phone: "Teléfono",
    color: "Color distintivo",
    requiredMark: "*",
  },
  actions: {
    cancel: "Cancelar",
    save: "Guardar cambios",
    saving: "Guardando...",
  },
  color: {
    custom: "Personalizado",
    remove: "Quitar",
  },
  success: "Perfil actualizado correctamente.",
  error: "No se pudo actualizar el perfil.",
} as const;

export const PROFILE_COLOR_PRESETS = [
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
