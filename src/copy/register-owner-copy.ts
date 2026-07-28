export const REGISTER_OWNER_COPY = {
  steps: [
    { title: "Tu cuenta", description: "Datos de acceso" },
    { title: "Tu clínica", description: "Información básica" },
    { title: "Confirmación", description: "Revisa y crea" },
  ],
  account: {
    title: "Crea tu cuenta de propietario",
    subtitle:
      "Usaremos estos datos para identificarte como administrador de la clínica.",
    fullNameLabel: "Nombre completo",
    fullNamePlaceholder: "Nombre y apellidos",
    emailLabel: "Email",
    emailPlaceholder: "correo@ejemplo.com",
    passwordLabel: "Contraseña",
    passwordPlaceholder: "••••••••",
    confirmPasswordLabel: "Confirmar contraseña",
  },
  clinic: {
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
  },
  confirmation: {
    title: "Revisa los datos",
    subtitle:
      "Crearemos tu cuenta y tu clínica cuando confirmes esta información.",
    accountTitle: "Propietario",
    clinicTitle: "Clínica",
    editAction: "Editar",
    emptyValue: "Sin especificar",
  },
  actions: {
    back: "Atrás",
    continue: "Continuar",
    create: "Crear clínica",
    creating: "Creando...",
  },
  errors: {
    fullNameRequired: "Introduce tu nombre completo",
    clinicNameRequired: "Introduce el nombre de la clínica",
    sessionUnavailable:
      "No se pudo iniciar la sesión. Comprueba tu email e inténtalo de nuevo.",
    createFailed: "No se pudo crear la clínica. Inténtalo de nuevo.",
  },
  configurationWarning:
    "Configura NEXT_PUBLIC_SUPABASE_URL y NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY.",
} as const;
