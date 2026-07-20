export const CLINIC_EDIT_COPY = {
  title: "Editar clínica",
  description: "Actualiza los datos de tu clínica.",
  fields: {
    name: "Nombre",
    phone: "Teléfono",
    address: "Dirección",
    specialty: "Especialidad",
    requiredMark: "*",
  },
  actions: {
    cancel: "Cancelar",
    save: "Guardar cambios",
    saving: "Guardando...",
  },
  success: "Clínica actualizada correctamente.",
  error: "No se pudo actualizar la clínica.",
} as const;
