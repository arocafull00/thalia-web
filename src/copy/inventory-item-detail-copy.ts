export const INVENTORY_ITEM_DETAIL_COPY = {
  back: "Volver a inventario",
  breadcrumbRoot: "Inventario",
  tabs: {
    summary: "Resumen",
    movements: "Movimientos",
  },
  moreActions: "Más acciones",
  sections: {
    stats: "Stock y precio",
    movements: "Historial de movimientos",
  },
  fields: {
    category: "Categoría",
    unit: "Unidad de medida",
    stock: "Stock actual",
    minStock: "Stock mínimo",
    level: "Estado",
    unitPrice: "Precio unitario",
    reference: "Referencia",
  },
  movements: {
    empty: "No hay movimientos registrados para este material.",
    types: {
      in: "Entrada",
      out: "Salida",
      adjustment: "Ajuste",
    },
    columns: {
      quantity: "Cantidad",
      employee: "Registrado por",
      notes: "Notas",
    },
  },
  actions: {
    adjustStock: "Ajustar stock",
    edit: "Editar material",
    delete: "Eliminar material",
    viewDetail: "Ver detalle",
    comingSoon: "Próximamente",
  },
  adjustStock: {
    title: "Ajustar stock",
    description: "Registra una entrada o salida de inventario.",
    fields: {
      type: "Tipo de movimiento",
      quantity: "Cantidad",
      notes: "Notas",
    },
    types: {
      in: "Entrada",
      out: "Salida",
    },
    actions: {
      cancel: "Cancelar",
      save: "Registrar",
      saving: "Registrando...",
    },
    preview: {
      currentStock: "Stock actual",
      resultingStock: "Stock resultante",
    },
    validation: {
      employeeRequired: "No hay empleado activo.",
      quantityInvalid: "La cantidad debe ser un número válido.",
      quantityPositive: "La cantidad debe ser mayor que cero.",
      insufficientStock: "No hay stock suficiente para esta salida.",
    },
    success: "Movimiento registrado correctamente.",
    error: "No se pudo registrar el movimiento.",
  },
  errors: {
    load: "No se pudo cargar el material.",
    movements: "No se pudo cargar el historial de movimientos.",
  },
} as const;
