export const APP_SIDEBAR_COPY = {
  sections: {
    general: "General",
    clinic: "Clínica",
    business: "Negocio",
    configuration: "Configuración",
  },
} as const;

export type AppNavSectionId = keyof typeof APP_SIDEBAR_COPY.sections;
