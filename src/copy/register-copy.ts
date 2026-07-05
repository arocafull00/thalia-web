export const REGISTER_COPY = {
  title: "Empieza a usar Thalia en pasos",
  subtitle: "¿Cómo quieres registrarte?",
  owner: {
    title: "Soy propietario",
    description: "Quiero crear y gestionar mi propia clínica.",
  },
  employee: {
    title: "Soy empleado",
    description: "He recibido una invitación para unirme a una clínica.",
  },
  employeeEmail: {
    title: "Accede con tu invitación",
    subtitle: "Introduce el correo con el que recibiste la invitación.",
    emailLabel: "Email",
    continueButton: "Continuar",
    backButton: "Volver",
    errors: {
      emailRequired: "Introduce tu correo",
      notInvited:
        "El correo introducido no tiene invitaciones pendientes en Thalia. Por favor pongase en contacto con el administrador de la clínica.",
      lookupFailed: "No se pudo verificar la invitación. Inténtalo de nuevo.",
    },
  },
} as const;
