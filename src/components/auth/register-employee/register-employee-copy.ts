import type { OnboardingIntent } from "@/stores/onboarding-intent-store";

type RegisterCopy = {
  title: string;
  subtitle: string;
};

type SidebarCopy = {
  tagline: string;
};

const SIDEBAR_COPY: Record<OnboardingIntent, SidebarCopy> = {
  owner: {
    tagline: "Configura tu clínica en minutos.",
  },
  employee: {
    tagline: "Únete al equipo de tu clínica.",
  },
};

const REGISTER_COPY: Record<OnboardingIntent, Record<"withSession" | "withoutSession", RegisterCopy>> = {
  employee: {
    withSession: {
      title: "Crea tu cuenta",
      subtitle: "Confirma tu nombre para unirte a las clínicas que te soliciten.",
    },
    withoutSession: {
      title: "Crea tu cuenta",
      subtitle: "Una cuenta para recibir solicitudes de las clínicas que te añadan.",
    },
  },
  owner: {
    withSession: {
      title: "Tu perfil",
      subtitle: "Confirma tu nombre antes de configurar tu clínica.",
    },
    withoutSession: {
      title: "Tu perfil",
      subtitle: "Crea tu cuenta de administrador. En el siguiente paso configurarás la clínica.",
    },
  },
};

export const REGISTER_EMPLOYEE_FORM_COPY = {
  fullNameLabel: "Nombre completo",
  emailLabel: "Email",
  passwordLabel: "Contraseña",
  continueButton: "Continuar",
  savingButton: "Guardando...",
  loginPrompt: "¿Ya tienes cuenta?",
  loginAction: "Iniciar sesión",
  supabaseWarning: "Configura NEXT_PUBLIC_SUPABASE_URL y NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY.",
  errors: {
    fullNameRequired: "Introduce tu nombre completo",
    credentialsRequired: "Introduce email y contraseña",
    saveFailed: "No se pudo guardar tu perfil",
  },
} as const;

export const REGISTER_EMPLOYEE_SIDEBAR_COPY = {
  brand: "Thalia",
  stepLabel: (current: number, total: number) => `Paso ${current} de ${total}`,
} as const;

export function getRegisterCopy(intent: OnboardingIntent, hasSession: boolean): RegisterCopy {
  const sessionKey = hasSession ? "withSession" : "withoutSession";

  return REGISTER_COPY[intent][sessionKey];
}

export function getSidebarCopy(intent: OnboardingIntent): SidebarCopy {
  return SIDEBAR_COPY[intent];
}
