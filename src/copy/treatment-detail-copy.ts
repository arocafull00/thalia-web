export const TREATMENT_DETAIL_COPY = {
  back: "Volver a tratamientos",
  breadcrumbRoot: "Tratamientos",
  sections: {
    info: "Información",
    materials: "Materiales estándar",
    images: "Imágenes de pacientes",
  },
  fields: {
    category: "Categoría",
    duration: "Duración",
    price: "Precio",
    color: "Color distintivo",
  },
  materials: {
    hint: "Estos materiales se consumirán automáticamente al completar una cita, salvo que se personalicen en la cita.",
    empty: "Sin materiales asociados.",
  },
  images: {
    hint: "Fotos de pacientes vinculadas a este tratamiento.",
    empty: "Todavía no hay imágenes asociadas a este tratamiento.",
    loading: "Cargando imágenes del tratamiento",
    loadMore: "Cargar más",
    retry: "Reintentar carga",
    unknownPatient: "Paciente",
    loadedCount: (count: number) => `${count} fotos cargadas`,
    totalCount: (count: number) => (count === 1 ? "1 foto" : `${count} fotos`),
    imageAlt: (patientName: string) => `Imagen de ${patientName}`,
    viewImage: (patientName: string) => `Ver imagen de ${patientName}`,
  },
  actions: {
    edit: "Editar tratamiento",
    delete: "Eliminar tratamiento",
  },
  moreActions: "Más acciones",
  errors: {
    load: "No se pudo cargar el tratamiento.",
    notFound: "Tratamiento no encontrado.",
    loadImages: "No se pudieron cargar las imágenes del tratamiento.",
  },
} as const;
