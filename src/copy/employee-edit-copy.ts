export const EMPLOYEE_EDIT_COPY = {
  title: "Editar empleado",
  description: "Actualiza los datos del profesional.",
  fields: {
    fullName: "Nombre completo",
    role: "Rol",
    specialty: "Especialidad",
    phone: "Teléfono",
    requiredMark: "*",
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
