export const INVENTORY_COPY = {
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
  summary: {
    critical: "Crítico",
    low: "Bajo",
    optimal: "Óptimo",
    filterBy: (label: string) => `Filtrar por stock ${label.toLowerCase()}`,
    clearFilter: (label: string) =>
      `Quitar el filtro de stock ${label.toLowerCase()}`,
  },
} as const;
