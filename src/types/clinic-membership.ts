import type {
  ClinicBillingSummary,
  ClinicMembershipRole,
  ClinicMembershipStatus,
} from "@/types/database.types";

export type ClinicMembershipView = {
  id: string;
  clinicId: string;
  clinicName: string;
  clinicLogoUrl: string | null;
  clinicTimezone: string | null;
  billing: ClinicBillingSummary;
  role: ClinicMembershipRole;
  status: ClinicMembershipStatus;
};
