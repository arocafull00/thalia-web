export const FINANCES_COPY = {
  title: "Finanzas",
  newMovement: "Nuevo movimiento",
  export: {
    action: "Exportar CSV",
    title: "Exportar información financiera",
    description:
      "Selecciona los movimientos y el periodo que quieres incluir en el archivo.",
    fields: {
      type: "Movimientos",
      from: "Desde",
      to: "Hasta",
      categories: "Categorías",
    },
    types: {
      all: "Cobros y gastos",
      income: "Cobros",
      expense: "Gastos",
    },
    allCategories: "Sin seleccionar se exportan todas las categorías.",
    searchCategory: "Buscar categoría...",
    noCategories: "No hay categorías disponibles para estos movimientos.",
    archivedSuffix: " (Archivada)",
    cancel: "Cancelar",
    submit: "Exportar",
    submitting: "Exportando...",
    success: (count: number) =>
      `${count} ${count === 1 ? "movimiento exportado" : "movimientos exportados"}.`,
    empty: "No hay movimientos con los filtros seleccionados.",
    error: "No se pudo generar la exportación.",
  },
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
  incomeExpenseRatio: {
    title: "Gastos sobre ingresos",
    income: "Ingresos",
    expenses: "Gastos",
    empty: "Sin movimientos durante este mes.",
    noIncome: "Sin ingresos para calcular el ratio.",
    summary: (percentage: number) =>
      `Los gastos equivalen al ${percentage}% de los ingresos.`,
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
  views: {
    summary: "Resumen",
    movements: "Movimientos",
  },
} as const;
