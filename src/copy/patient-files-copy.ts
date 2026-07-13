import type { PatientFileCategory } from "@/types/database.types";

export const PATIENT_FILES_COPY = {
  title: "Archivos",
  filesCount: (count: number) => `${count} archivo${count === 1 ? "" : "s"}`,
  actions: {
    upload: "Subir archivo",
    view: "Visualizar",
    download: "Descargar",
    edit: "Editar",
    delete: "Eliminar",
    rowMenu: "Acciones del archivo",
  },
  categories: {
    all: "Todas las categorías",
    consentimiento: "Consentimiento",
    historia_clinica: "Historia clínica",
    receta: "Receta",
    analitica: "Analítica",
    informe: "Informe",
    otro: "Otro",
  } satisfies Record<"all", string> & Record<PatientFileCategory, string>,
  filters: {
    category: "Categoría",
    categoryPlaceholder: "Filtrar por categoría",
  },
  empty: "No hay archivos que coincidan con el filtro seleccionado.",
  emptyFiles: "Este paciente aún no tiene archivos.",
  errors: {
    load: "No se pudieron cargar los archivos del paciente.",
    signedUrl: "No se pudo generar la URL del archivo.",
  },
  uploader: {
    title: "Subir archivo",
    description: "Añade un documento asociado al paciente.",
    dropzone: "Arrastra un archivo aquí o selecciónalo",
    dropzoneActive: "Suelta el archivo para subirlo",
    chooseFile: "Seleccionar archivo",
    addMore: "Añadir otro",
    fields: {
      category: "Categoría",
      notes: "Notas",
    },
    categoryPlaceholder: "Selecciona una categoría",
    submit: "Subir archivo",
    pending: "Subiendo...",
    success: (count: number) =>
      `${count} archivo${count === 1 ? "" : "s"} subido${count === 1 ? "" : "s"} correctamente`,
    error: "No se pudo subir el archivo",
    validation: {
      fileRequired: "Selecciona al menos un archivo para continuar.",
      categoryRequired: "Selecciona una categoría.",
      clinicRequired: "No hay una clínica activa.",
      formInvalid: "Revisa los campos marcados antes de continuar.",
      invalidFile: "El archivo seleccionado no es válido.",
    },
    progress: (current: number, total: number) =>
      `Subiendo archivo ${current} de ${total}...`,
  },
  edit: {
    title: "Editar archivo",
    description: "Actualiza la categoría o las notas del archivo.",
    submit: "Guardar cambios",
    pending: "Guardando...",
    success: "Archivo actualizado correctamente",
    error: "No se pudo actualizar el archivo",
    cancel: "Cancelar",
  },
  delete: {
    title: "Eliminar archivo",
    description: (filename: string) =>
      `¿Eliminar "${filename}"? Esta acción es permanente y no se puede deshacer.`,
    confirm: "Eliminar",
    cancel: "Cancelar",
    pending: "Eliminando...",
    success: "Archivo eliminado correctamente",
    error: "No se pudo eliminar el archivo",
  },
  viewer: {
    close: "Cerrar visor",
    download: "Descargar",
    previousPage: "Página anterior",
    nextPage: "Página siguiente",
    page: (current: number, total: number) => `Página ${current} de ${total}`,
    zoomIn: "Acercar",
    zoomOut: "Alejar",
    docxTitle: "Vista previa no disponible",
    docxDescription:
      "Los archivos DOCX no se pueden visualizar en el navegador. Descárgalo para abrirlo.",
    loading: "Cargando archivo...",
    error: "No se pudo cargar el archivo.",
  },
} as const;

export function getPatientFileCategoryLabel(category: PatientFileCategory) {
  return PATIENT_FILES_COPY.categories[category];
}

export const PATIENT_FILE_CATEGORY_OPTIONS = (
  Object.keys(PATIENT_FILES_COPY.categories) as Array<
    keyof typeof PATIENT_FILES_COPY.categories
  >
)
  .filter((key): key is PatientFileCategory => key !== "all")
  .map((value) => ({
    value,
    label: PATIENT_FILES_COPY.categories[value],
  }));
