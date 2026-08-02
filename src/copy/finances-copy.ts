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
    empty: "Sin movimientos categorizados.",
  },
  movements: {
    title: "Movimientos recientes",
    loadMore: "Cargar más",
  },
} as const;
