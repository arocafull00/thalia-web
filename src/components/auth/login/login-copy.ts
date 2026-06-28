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
    emailPlaceholder: "Ingresa tu correo electrónico",
    passwordLabel: "Contraseña",
    passwordPlaceholder: "Ingresa tu contraseña",
    requiredMark: "*",
  },
  submit: {
    idle: "Iniciar sesión",
    loading: "Entrando...",
  },
  divider: "O continúa con",
  google: "Continuar con Google",
  supabaseWarning: "Configura NEXT_PUBLIC_SUPABASE_URL y NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY.",
  footer: {
    copyright: "© Thalia. Todos los derechos reservados",
    terms: "Términos y condiciones",
    privacy: "Política de privacidad",
  },
  hero: {
    headline: "Un centro unificado para gestionar tu clínica con claridad",
    body: "Thalia te ofrece un panel único para citas, pacientes, inventario y finanzas, con una visión completa de tu clínica en tiempo real.",
  },
} as const;
