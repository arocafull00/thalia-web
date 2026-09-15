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
  planName: "Thalia Normal",
  price: "80 €/mes + IVA",
  trial: "30 días gratis",
  noCard: "Sin tarjeta para empezar",
  clinicBilling: "Facturación mensual por clínica",
  checkoutAction: "Empezar prueba gratuita",
  portalAction: "Gestionar suscripción",
  ownerBlockedTitle: "Activa la suscripción de tu clínica",
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
  trialEnds: "Fin de la prueba",
  periodEnds: "Fin del periodo actual",
  signOut: "Cerrar sesión",
  noActiveClinic: "No hay una clínica activa.",
  existingSubscription: "Gestiona la suscripción existente desde el Portal.",
  scheduledCancellation: "Cancelación programada al final del periodo",
} as const;
