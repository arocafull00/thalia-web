export const FINANCES_COPY = {
  title: "Finanzas",
  newMovement: "Nuevo movimiento",
  errors: {
    permissions: "Permisos insuficientes.",
    summary: "No se pudo cargar el resumen.",
    transactions: "No se pudieron cargar los movimientos.",
  },
  filters: {
    category: "Categoría",
    all: "Todos",
  },
  filterLabels: {
    search: "Buscar movimiento",
    category: "Categoría",
  },
  metrics: {
    income: "Ingresos",
    expenses: "Gastos",
    net: "Balance neto",
    difference: "Diferencia",
  },
  weekly: {
    title: "Desglose semanal",
  },
  categories: {
    title: "Desglose por categoría",
    new: "Nueva categoría",
    manage: "Gestionar",
    manageTitle: "Gestionar categorías financieras",
    manageDescription:
      "Crea, renombra, archiva o restaura las categorías de la clínica.",
    empty: "Sin movimientos categorizados.",
    archivedSuffix: " (Archivada)",
  },
  movements: {
    title: "Movimientos recientes",
  },
} as const;
