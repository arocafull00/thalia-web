export const TRANSACTION_CATEGORIES_COPY = {
  title: "Categorías financieras",
  description:
    "Organiza los ingresos y gastos de la clínica para mejorar filtros e informes.",
  groups: {
    income: "Ingresos",
    expense: "Gastos",
    active: "Activas",
    archived: "Archivadas",
    emptyActive: "No hay categorías activas.",
    emptyArchived: "No hay categorías archivadas.",
  },
  fields: {
    name: "Nombre",
    type: "Tipo",
    income: "Ingreso",
    expense: "Gasto",
    typePlaceholder: "Selecciona un tipo",
  },
  actions: {
    add: "Añadir categoría",
    edit: "Editar",
    archive: "Archivar",
    restore: "Restaurar",
    cancel: "Cancelar",
    save: "Guardar",
    saving: "Guardando...",
    archiving: "Archivando...",
  },
  form: {
    createTitle: "Nueva categoría",
    editTitle: "Editar categoría",
    createDescription: "Define el nombre y el tipo de la categoría.",
    editDescription: "El tipo no puede modificarse después de crearla.",
  },
  archive: {
    title: "Archivar categoría",
    description: (name: string) =>
      `La categoría “${name}” dejará de estar disponible para nuevos movimientos, pero conservará su histórico.`,
  },
  success: {
    created: "Categoría creada correctamente.",
    renamed: "Categoría actualizada correctamente.",
    archived: "Categoría archivada correctamente.",
    restored: "Categoría restaurada correctamente.",
  },
  errors: {
    load: "No se pudieron cargar las categorías financieras.",
    mutation: "No se pudo guardar la categoría.",
  },
} as const;
