export const SEARCH_COPY = {
  placeholders: {
    "/patients": "Buscar pacientes...",
    "/employees": "Buscar empleados...",
    "/appointments": "Buscar citas...",
    "/inventory": "Buscar materiales...",
    "/treatments": "Buscar tratamientos...",
    "/finances": "Buscar por concepto...",
    "/marketing": "Buscar campañas...",
  },
  clear: "Limpiar búsqueda",
  filters: {
    all: "Todos",
    active: "Activos",
    inactive: "Inactivos",
    critical: "Crítico",
    low: "Bajo",
    optimal: "Óptimo",
    loadMore: "Cargar más",
  },
} as const;

export const SEARCHABLE_ROUTES = Object.keys(
  SEARCH_COPY.placeholders,
) as (keyof typeof SEARCH_COPY.placeholders)[];

export function getSearchPlaceholder(pathname: string) {
  const route = SEARCHABLE_ROUTES.find((entry) => pathname.startsWith(entry));
  if (!route) {
    return "";
  }

  return SEARCH_COPY.placeholders[route];
}
