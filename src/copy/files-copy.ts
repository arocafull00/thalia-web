import type { PatientFilesSort } from "@/dal/patient-files.dal";

export const FILES_COPY = {
  page: {
    title: "Archivos",
    description: "Documentos de todos los pacientes de la clínica.",
    loadError: "No se pudieron cargar los archivos.",
    empty: "Todavía no hay archivos de pacientes.",
    emptyFiltered: "No hay archivos que coincidan con los filtros.",
    emptyHint: "Los archivos subidos desde un paciente aparecerán aquí.",
    results: (count: number) => `${count} archivo${count === 1 ? "" : "s"}`,
  },
  filters: {
    patientSearch: "Buscar por paciente...",
    category: "Categoría",
    allCategories: "Todas las categorías",
    date: "Fecha",
    anyDate: "Cualquier fecha",
    dateFrom: "Desde",
    dateTo: "Hasta",
    clearDate: "Limpiar fechas",
    sort: "Orden",
  },
  filterLabels: {
    search: "Buscar por paciente",
    category: "Categoría",
    date: "Fecha",
    dateFrom: "Desde",
    dateTo: "Hasta",
    sort: "Orden",
  },
  sort: {
    newest: "Más recientes",
    oldest: "Más antiguos",
    name_asc: "Archivo A–Z",
    name_desc: "Archivo Z–A",
  } satisfies Record<PatientFilesSort, string>,
  table: {
    file: "Archivo",
    patient: "Paciente",
    category: "Categoría",
    date: "Fecha",
    size: "Tamaño",
    actions: "Acciones",
  },
  pagination: {
    previous: "Anterior",
    next: "Siguiente",
    page: (current: number, total: number) => `Página ${current} de ${total}`,
    range: (from: number, to: number, total: number) =>
      `${from}–${to} de ${total}`,
  },
} as const;
