import type { BillingStatus } from "@/types/database.types";

export const BILLING_STATUS_LABELS = {
  not_started: "Sin iniciar",
  incomplete: "Pago pendiente",
  incomplete_expired: "Configuración caducada",
  trialing: "Periodo de prueba",
  active: "Activa",
  past_due: "Pago atrasado",
  canceled: "Cancelada",
  unpaid: "Impagada",
  paused: "Pausada",
} satisfies Record<BillingStatus, string>;

export const BILLING_COPY = {
  planLabel: "Plan",
  planName: "Thalia Normal",
  priceAmount: "80 €",
  priceCadence: "/mes + IVA",
  trialDaysLabel: "Días de prueba gratuita",
  trialDaysValue: "30",
  cardRequiredLabel: "Tarjeta requerida para empezar",
  cardRequiredValue: "No",
  billingCycleLabel: "Ciclo de facturación",
  billingCycleValue: "Mensual, por clínica",
  trialTotalLabel: "Total durante la prueba",
  trialTotalValue: "0,00 €",
  afterTrialLabel: "Al finalizar la prueba",
  afterTrialValue: "80 € + IVA/mes con tarjeta",
  trialChargeDisclaimerLead: "No se cobra nada al empezar.",
  trialChargeDisclaimerRest:
    "Tras 30 días se facturan 80 € + IVA al mes solo si has añadido un método de pago; si no, la suscripción se pausa.",
  checkoutAction: "Empezar prueba gratuita",
  portalAction: "Gestionar suscripción",
  ownerBlockedTitle: "Empieza tu prueba gratuita",
  ownerBlockedDescription:
    "Inicia la prueba gratuita o regulariza el método de pago para recuperar el acceso completo.",
  memberBlockedTitle: "La suscripción de la clínica necesita atención",
  memberBlockedDescription:
    "Pide al propietario de la clínica que gestione la suscripción para recuperar el acceso.",
  waitingTitle: "Confirmando tu suscripción",
  waitingDescription:
    "Stripe está confirmando el periodo de prueba. Esta pantalla se actualizará automáticamente.",
  checkoutCancelled: "No se ha iniciado la suscripción.",
  checkoutError: "No se pudo abrir el pago seguro de Stripe.",
  portalError: "No se pudo abrir el portal de facturación.",
  settingsTitle: "Suscripción",
  status: "Estado",
  exemptStatus: "Acceso gratuito",
  trialEnds: "Fin de la prueba",
  periodEnds: "Fin del periodo actual",
  signOut: "Cerrar sesión",
  signOutError: "No se pudo cerrar la sesión.",
  noActiveClinic: "No hay una clínica activa.",
  existingSubscription: "Gestiona la suscripción existente desde el Portal.",
  scheduledCancellation: "Cancelación programada al final del periodo",
} as const;
