export const LOADER_COPY = {
  boot: {
    eyebrow: "Inicio seguro",
    title: "Preparando tu clínica",
    description:
      "Estamos organizando agenda, pacientes y permisos para que encuentres todo exactamente donde lo dejaste.",
    footer: "Tus datos permanecen protegidos durante todo el proceso",
    progressLabel: "Cargando aplicación",
    steps: [
      { label: "Verificando tu sesión" },
      { label: "Sincronizando la información de la clínica" },
      { label: "Preparando tu panel de trabajo" },
    ],
    tags: {
      done: "Listo",
      current: "Ahora",
      pending: "Después",
    },
  },
  redirect: {
    eyebrow: "Un momento",
    title: "Redirigiendo",
    description:
      "Estamos llevándote a la pantalla correcta. En un instante podrás continuar.",
    footer: "Redirigiendo…",
  },
} as const;
