import type { ClinicMembershipInvitationRole } from "@/types/database.types";

type ClinicInvitationErrorCode =
  | "already_member_of_clinic"
  | "default"
  | "employee_role_required"
  | "invitation_account_type_conflict"
  | "invitation_already_used"
  | "invitation_email_mismatch"
  | "invitation_expired"
  | "invitation_not_found"
  | "owner_cannot_join_other_clinics"
  | "user_already_belongs_to_clinic";

type ClinicInvitationCopy = {
  sectionTitle: string;
  notificationTitle: (clinicName: string) => string;
  notificationBody: (roleLabel: string) => string;
  review: string;
  reviewAriaLabel: (clinicName: string) => string;
  loadError: string;
  retry: string;
  dialog: {
    title: string;
    description: (clinicName: string) => string;
    fields: {
      clinic: string;
      role: string;
      expiresAt: string;
    };
    actions: {
      accept: string;
      accepting: string;
      reject: string;
      rejecting: string;
    };
  };
  toast: {
    accepted: (clinicName: string) => string;
    rejected: string;
  };
  errors: Record<ClinicInvitationErrorCode, string>;
  roleLabels: Record<ClinicMembershipInvitationRole, string>;
};

export const CLINIC_INVITATION_COPY = {
  sectionTitle: "Invitaciones de clínicas",
  notificationTitle: (clinicName) => `Invitación de ${clinicName}`,
  notificationBody: (roleLabel) =>
    `Te han invitado a unirte como ${roleLabel.toLowerCase()}.`,
  review: "Revisar",
  reviewAriaLabel: (clinicName) => `Revisar la invitación de ${clinicName}`,
  loadError: "No se pudieron cargar las invitaciones de clínicas.",
  retry: "Reintentar",
  dialog: {
    title: "Revisar invitación",
    description: (clinicName) => `Confirma si quieres unirte a ${clinicName}.`,
    fields: {
      clinic: "Clínica",
      role: "Rol",
      expiresAt: "Caduca",
    },
    actions: {
      accept: "Aceptar",
      accepting: "Aceptando…",
      reject: "Rechazar",
      rejecting: "Rechazando…",
    },
  },
  toast: {
    accepted: (clinicName) =>
      `Invitación aceptada. Ahora estás en ${clinicName}.`,
    rejected: "Invitación rechazada.",
  },
  errors: {
    already_member_of_clinic: "Ya perteneces a esta clínica.",
    default: "No se pudo responder a la invitación. Inténtalo de nuevo.",
    employee_role_required: "No se pudo determinar tu profesión.",
    invitation_account_type_conflict:
      "Esta invitación no corresponde a una cuenta de autónomo.",
    invitation_already_used: "Esta invitación ya ha sido respondida.",
    invitation_email_mismatch:
      "La invitación pertenece a otra dirección de email.",
    invitation_expired: "Esta invitación ha caducado.",
    invitation_not_found: "La invitación ya no está disponible.",
    owner_cannot_join_other_clinics:
      "Los propietarios no pueden unirse a otra clínica.",
    user_already_belongs_to_clinic:
      "Solo los autónomos pueden pertenecer a varias clínicas.",
  },
  roleLabels: {
    admin: "Administrador",
    employee: "Empleado",
    external: "Externo",
  },
} satisfies ClinicInvitationCopy;
