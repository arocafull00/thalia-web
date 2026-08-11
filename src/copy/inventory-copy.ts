export const INVENTORY_COPY = {
  list: {
    actions: {
      label: "Acciones del material",
      view: "Ver detalle",
      edit: "Editar material",
    },
    columns: {
      actions: "Acciones",
    },
  },
  page: {
    title: "Inventario de Materiales",
    loadError: "No se pudo cargar el inventario.",
  },
  filters: {
    category: "Categoría",
    stock: "Nivel de stock",
    all: "Todos",
    critical: "Crítico",
    low: "Bajo",
    optimal: "Óptimo",
  },
  filterLabels: {
    search: "Buscar material",
    category: "Categoría",
    stock: "Nivel de stock",
  },
  summary: {
    critical: "Crítico",
    low: "Bajo",
    optimal: "Óptimo",
    filterBy: (label: string) => `Filtrar por stock ${label.toLowerCase()}`,
    clearFilter: (label: string) =>
      `Quitar el filtro de stock ${label.toLowerCase()}`,
  },
} as const;
