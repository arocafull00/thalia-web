export const TRANSACTION_CREATE_COPY = {
  title: "Nuevo movimiento",
  description: "Registra un ingreso o gasto de la clínica.",
  fields: {
    type: "Tipo",
    amount: "Importe",
    date: "Fecha",
    category: "Categoría",
    description: "Descripción",
    requiredMark: "*",
    typeIncome: "Ingreso",
    typeExpense: "Gasto",
  },
  actions: {
    cancel: "Cancelar",
    save: "Guardar",
    saving: "Guardando...",
  },
  validation: {
    clinicRequired: "No hay clínica activa.",
    profileRequired: "No se pudo identificar al usuario.",
  },
  success: "Movimiento creado correctamente.",
  error: "No se pudo crear el movimiento.",
} as const;
