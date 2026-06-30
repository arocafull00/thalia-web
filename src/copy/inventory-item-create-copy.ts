export const INVENTORY_ITEM_CREATE_COPY = {
  title: "Añadir material",
  description: "Registra un nuevo material en el inventario.",
  fields: {
    name: "Nombre",
    category: "Categoría",
    unit: "Unidad",
    stock: "Stock inicial",
    minStock: "Stock mínimo",
    unitPrice: "Precio unitario",
    requiredMark: "*",
  },
  actions: {
    cancel: "Cancelar",
    save: "Guardar",
    saving: "Guardando...",
  },
  validation: {
    nameRequired: "El nombre es obligatorio.",
    clinicRequired: "No hay clínica activa.",
    stockInvalid: "El stock debe ser un número válido.",
    minStockInvalid: "El stock mínimo debe ser un número válido.",
    unitPriceInvalid: "El precio debe ser un número válido.",
  },
  success: "Material añadido correctamente.",
  error: "No se pudo añadir el material.",
} as const;
