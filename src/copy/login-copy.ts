export const LOGIN_COPY = {
  brand: "Thalia",
  title: "Bienvenido a Thalia",
  subtitle: "Comienza tu experiencia iniciando sesión o creando tu cuenta.",
  tabs: {
    signIn: "Iniciar sesión",
    register: "Registrarse",
  },
  fields: {
    emailLabel: "Correo electrónico",
    emailPlaceholder: "correo@ejemplo.com",
    passwordLabel: "Contraseña",
    passwordPlaceholder: "••••••••",
    requiredMark: "*",
  },
  submit: {
    idle: "Iniciar sesión",
    loading: "Entrando...",
  },
  divider: "O continúa con",
  google: "Continuar con Google",
  supabaseWarning:
    "Configura NEXT_PUBLIC_SUPABASE_URL y NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY.",
  footer: {
    copyright: "© Thalia. Todos los derechos reservados",
    terms: "Términos y condiciones",
    privacy: "Política de privacidad",
  },
  hero: {
    headline: "Un centro unificado para gestionar tu clínica con claridad",
    body: "Thalia te ofrece un panel único para citas, pacientes, inventario y finanzas, con una visión completa de tu clínica en tiempo real.",
  },
  forgotPassword: {
    link: "He olvidado mi contraseña",
    title: "Recuperar contraseña",
    description:
      "Introduce tu email y te enviaremos un enlace para restablecer tu contraseña.",
    submit: {
      idle: "Enviar enlace",
      loading: "Enviando...",
    },
    success:
      "¡Listo! Revisa tu bandeja de entrada. Si existe una cuenta con ese email, recibirás un enlace de recuperación.",
    backToLogin: "Volver a iniciar sesión",
  },
  resetPassword: {
    title: "Establecer nueva contraseña",
    description: "Introduce tu nueva contraseña.",
    newPassword: "Nueva contraseña",
    confirmPassword: "Confirmar contraseña",
    submit: {
      idle: "Cambiar contraseña",
      loading: "Cambiando...",
    },
    success:
      "¡Listo! Contraseña actualizada correctamente. Ya puedes iniciar sesión.",
  },
} as const;
