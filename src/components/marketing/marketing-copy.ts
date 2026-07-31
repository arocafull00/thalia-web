export const MARKETING_COPY = {
  page: {
    title: "Marketing",
    description:
      "Las campañas y acciones de marketing estarán disponibles próximamente.",
    loadError: "No se pudieron cargar las campañas.",
  },
  empty: {
    title: "Aún no hay campañas",
    description:
      "Crea tu primera campaña para enviar promociones y avisos a tus pacientes por WhatsApp.",
  },
  list: {
    emptyFiltered: "No hay campañas con ese criterio.",
    columns: {
      title: "Campaña",
      content: "Mensaje",
      image: "Imagen",
      status: "Estado",
      date: "Fecha",
    },
    viewImage: "Ver imagen",
    noImage: "Sin imagen",
    noDate: "Sin fecha",
    scheduledFor: "Programada para el",
    sentOn: "Enviada el",
    createdOn: "Creada el",
  },
  imageDialog: {
    title: "Imagen de la campaña",
    loading: "Cargando imagen...",
    error: "No se pudo cargar la imagen.",
    close: "Cerrar",
  },
  status: {
    draft: "Borrador",
    scheduled: "Programada",
    sent: "Enviada",
    cancelled: "Cancelada",
  },
  actions: {
    create: "Nueva campaña",
  },
  createDialog: {
    title: "Nueva campaña",
    description:
      "Redacta el mensaje y elige a qué pacientes se enviará por WhatsApp.",
    sections: {
      message: "Mensaje",
      footer: "Pie del mensaje",
      segment: "Destinatarios",
      preview: "Vista previa",
    },
    fields: {
      title: "Título",
      titlePlaceholder: "Promoción de julio",
      content: "Mensaje",
      contentPlaceholder:
        "Hola, este mes tenemos un 20% en tratamientos faciales...",
      footerText: "Texto del pie",
      footerWebsite: "Web",
      footerPhone: "Teléfono de contacto",
      treatment: "Ha recibido el tratamiento",
      monthsSinceLastVisit: "No viene desde hace (meses)",
      minVisits: "Visitas mínimas",
      maxVisits: "Visitas máximas",
      minAge: "Edad mínima",
      maxAge: "Edad máxima",
      anyTreatment: "Cualquiera",
      requiredMark: "*",
    },
    actions: {
      cancel: "Cancelar",
      save: "Guardar borrador",
      saving: "Guardando...",
    },
    validation: {
      clinicRequired: "No hay clínica activa.",
    },
    success: "Campaña guardada como borrador.",
    error: "No se pudo guardar la campaña.",
  },
  segmentPreview: {
    loading: "Calculando destinatarios...",
    error: "No se pudo calcular el segmento.",
    none: "Ningún paciente cumple estos criterios.",
    one: "1 paciente recibirá esta campaña.",
    many: (count: number) => `${count} pacientes recibirán esta campaña.`,
    consentNote:
      "Solo se cuentan pacientes con consentimiento de marketing y teléfono.",
  },
  messagePreview: {
    empty: "El mensaje aparecerá aquí mientras lo escribes.",
    imageAlt: "Imagen destacada de la campaña",
  },
  image: {
    label: "Imagen destacada",
    chooseFile: "Elegir imagen",
    dropzone: "JPG, PNG o WEBP. Máximo 5 MB.",
    dropzoneActive: "Suelta la imagen aquí.",
    uploadError: "No se pudo subir la imagen.",
  },
  detail: {
    breadcrumbRoot: "Marketing",
    back: "Volver a marketing",
    loadError: "No se pudo cargar la campaña.",
    sections: {
      message: "Mensaje",
      recipients: "Destinatarios",
    },
    recipients: {
      empty: "Todavía no se ha enviado a nadie.",
      pending: "Pendiente",
      sent: "Enviado",
      failed: "Falló",
      columnPatient: "Paciente",
      columnStatus: "Estado",
      columnPhone: "Teléfono",
    },
  },
  send: {
    action: "Enviar campaña",
    sending: "Enviando...",
    confirmTitle: "Enviar campaña",
    confirmDescription: (count: number) =>
      count === 1
        ? "Se enviará el mensaje a 1 paciente por WhatsApp. Esta acción no se puede deshacer."
        : `Se enviará el mensaje a ${count} pacientes por WhatsApp. Esta acción no se puede deshacer.`,
    confirmNoRecipients:
      "Ningún paciente cumple los criterios de esta campaña, así que no se enviará nada.",
    confirm: "Enviar ahora",
    cancel: "Cancelar",
    success: (count: number) =>
      count === 1
        ? "Campaña enviada a 1 paciente."
        : `Campaña enviada a ${count} pacientes.`,
    error: "No se pudo enviar la campaña.",
    alreadySent: "Esta campaña ya se envió.",
  },
} as const;
