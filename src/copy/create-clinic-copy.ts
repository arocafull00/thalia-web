export const CREATE_CLINIC_COPY = {
  title: "Configura tu clínica",
  subtitle:
    "Añade la información principal. Podrás completar el resto más adelante.",
  nameLabel: "Nombre de la clínica",
  namePlaceholder: "Clínica Thalia",
  addressLabel: "Dirección",
  addressPlaceholder: "Calle, número y localidad",
  phoneLabel: "Teléfono",
  phonePlaceholder: "+34 600 000 000",
  optionalLabel: "Opcional",
  actions: {
    back: "Atrás",
    signOut: "Salir",
    continue: "Continuar",
    creating: "Creando...",
  },
  errors: {
    clinicNameRequired: "Introduce el nombre de la clínica",
    profileIncomplete: "Completa tu perfil antes de crear la clínica",
    createFailed: "No se pudo crear la clínica. Inténtalo de nuevo.",
  },
} as const;
