export const TREATMENT_DETAIL_COPY = {
  back: "Volver a tratamientos",
  breadcrumbRoot: "Tratamientos",
  sections: {
    info: "Información",
    materials: "Materiales estándar",
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
  actions: {
    edit: "Editar tratamiento",
    delete: "Eliminar tratamiento",
  },
  moreActions: "Más acciones",
  errors: {
    load: "No se pudo cargar el tratamiento.",
    notFound: "Tratamiento no encontrado.",
  },
} as const;
