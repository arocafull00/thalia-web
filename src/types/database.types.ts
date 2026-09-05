export type EmployeeRole = "admin" | "reception" | "doctor" | "auxiliary";

export type ClinicMembershipRole = "owner" | "admin" | "employee" | "external";

export type ClinicMembershipInvitationRole = Exclude<
  ClinicMembershipRole,
  "owner"
>;

export type ClinicMembershipStatus = "pending" | "active" | "suspended";

export type InvitationTokenRole = "admin" | "employee" | "external";

export type AppointmentStatus =
  | "scheduled"
  | "confirmed"
  | "in_progress"
  | "completed"
  | "cancelled"
  | "no_show";

export type InventoryMovementType = "in" | "out" | "adjustment";

export type InventoryAlert = {
  id: string;
  clinic_id: string;
  inventory_item_id: string;
  item_name: string;
  stock: number;
  min_stock: number;
  read_at: string | null;
  resolved_at: string | null;
  created_at: string | null;
};

export type TransactionType = "income" | "expense";

export type TransactionCategory = {
  id: string;
  clinic_id: string;
  type: TransactionType;
  name: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type TransactionCategorySummary = Pick<
  TransactionCategory,
  "id" | "type" | "name" | "is_active"
>;

export type Clinic = {
  id: string;
  name: string;
  address: string | null;
  phone: string | null;
  owner_id: string | null;
  logo_url: string | null;
  specialty: string | null;
  opening_time: string;
  closing_time: string;
  open_days: number[];
  timezone: string;
  whatsapp_reminder_enabled: boolean;
  whatsapp_reminder_hours: number[];
  whatsapp_phone_number_id: string | null;
  whatsapp_message_template: string;
  created_at: string | null;
  updated_at: string | null;
};

export type AppointmentReminderStatus = "sent" | "failed";

export type AppointmentReminder = {
  id: string;
  appointment_id: string;
  clinic_id: string;
  patient_phone: string;
  hours_before: number;
  sent_at: string;
  status: AppointmentReminderStatus;
  error_message: string | null;
  reminder_type: string;
  created_at: string;
};

export type ClinicMembership = {
  id: string;
  user_id: string;
  clinic_id: string;
  role: ClinicMembershipRole;
  status: ClinicMembershipStatus;
  invited_by: string | null;
  joined_at: string | null;
  created_at: string | null;
};

export type InvitationToken = {
  id: string;
  token: string;
  clinic_id: string;
  role: InvitationTokenRole;
  email: string;
  created_by: string;
  expires_at: string;
  used_at: string | null;
  used_by: string | null;
};

export type Employee = {
  id: string;
  clinic_id: string;
  full_name: string;
  role: EmployeeRole;
  specialty: string | null;
  color: string | null;
  avatar_url: string | null;
  phone: string | null;
  active: boolean | null;
  created_at: string | null;
  updated_at: string | null;
};

export type Patient = {
  id: string;
  clinic_id: string;
  full_name: string;
  dni: string | null;
  birth_date: string | null;
  phone: string | null;
  email: string | null;
  address: string | null;
  notes: string | null;
  avatar_url: string | null;
  marketing_opt_in: boolean;
  marketing_opt_out_at: string | null;
  created_at: string | null;
  updated_at: string | null;
};

export type PatientImagePhase = "antes" | "durante" | "despues";

export type PatientImage = {
  id: string;
  patient_id: string;
  clinic_id: string;
  storage_key: string;
  original_filename: string | null;
  mime_type: string | null;
  file_size_bytes: number | null;
  width: number | null;
  height: number | null;
  phase: PatientImagePhase | null;
  treatment_id: string | null;
  notes: string | null;
  captured_at: string | null;
  created_at: string | null;
};

export type PatientImageWithPatient = PatientImage & {
  patients: Pick<Patient, "id" | "full_name"> | null;
};

export type PatientImageInsert = {
  patient_id: string;
  clinic_id: string;
  storage_key: string;
  original_filename: string | null;
  mime_type: string;
  file_size_bytes: number;
  width: number;
  height: number;
  phase: PatientImagePhase | null;
  treatment_id: string | null;
  notes: string | null;
  captured_at: string;
};

export type PatientFileCategory =
  | "consentimiento"
  | "historia_clinica"
  | "receta"
  | "analitica"
  | "informe"
  | "otro";

export type PatientFile = {
  id: string;
  patient_id: string;
  clinic_id: string;
  storage_key: string;
  original_filename: string;
  mime_type: string;
  file_size_bytes: number;
  category: PatientFileCategory;
  notes: string | null;
  created_by: string | null;
  created_at: string;
  updated_at: string;
};

export type PatientFileInsert = {
  patient_id: string;
  clinic_id: string;
  storage_key: string;
  original_filename: string;
  mime_type: string;
  file_size_bytes: number;
  category: PatientFileCategory;
  notes: string | null;
  created_by: string | null;
};

export type PatientFileUpdate = Pick<PatientFile, "category" | "notes">;

export type PatientFileWithPatient = PatientFile & {
  patients: Pick<Patient, "id" | "full_name" | "avatar_url"> | null;
};

export type Treatment = {
  id: string;
  clinic_id: string;
  name: string;
  category: string | null;
  duration_minutes: number | null;
  color: string | null;
  price: number | null;
  created_at: string | null;
  updated_at: string | null;
};

export type TreatmentInventoryItem = {
  id: string;
  treatment_id: string;
  inventory_item_id: string;
  quantity: number;
  created_at: string | null;
};

export type TreatmentWithInventory = Treatment & {
  treatment_inventory_items: (TreatmentInventoryItem & {
    inventory_items: Pick<InventoryItem, "id" | "name" | "unit"> | null;
  })[];
};

export type Appointment = {
  id: string;
  clinic_id: string;
  patient_id: string;
  employee_id: string;
  starts_at: string;
  ends_at: string;
  status: AppointmentStatus | null;
  notes: string | null;
  reminder_sent: boolean | null;
  created_at: string | null;
  updated_at: string | null;
};

export type AppointmentTreatment = {
  id: string;
  appointment_id: string;
  treatment_id: string;
  price_at_booking: number;
  created_at: string | null;
};

export type AppointmentInventoryItem = {
  id: string;
  appointment_id: string;
  inventory_item_id: string;
  quantity: number;
  created_at: string | null;
};

export type AppointmentInventoryItemWithInventory = AppointmentInventoryItem & {
  inventory_items: Pick<InventoryItem, "id" | "name" | "unit"> | null;
};

export type AppointmentInventoryItemWithStock = AppointmentInventoryItem & {
  inventory_items: Pick<InventoryItem, "id" | "name" | "unit" | "stock"> | null;
};

export type AppointmentTreatmentInventoryItemWithStock =
  TreatmentInventoryItem & {
    inventory_items: Pick<
      InventoryItem,
      "id" | "name" | "unit" | "stock"
    > | null;
  };

export type InventoryItem = {
  id: string;
  clinic_id: string;
  name: string;
  category: string | null;
  unit: string | null;
  stock: number | null;
  min_stock: number | null;
  unit_price: number | null;
  /** Columna generada; ver 20260823120000_inventory_stock_level.sql. */
  stock_level: InventoryStockLevelValue;
  created_at: string | null;
  updated_at: string | null;
};

export type InventoryStockLevelValue = "critical" | "low" | "optimal";

export type InventoryMovement = {
  id: string;
  item_id: string;
  employee_id: string;
  type: InventoryMovementType;
  quantity: number;
  notes: string | null;
  created_at: string | null;
};

export type TransactionRow = {
  id: string;
  clinic_id: string;
  appointment_id: string | null;
  type: TransactionType;
  category_id: string | null;
  amount: number;
  description: string | null;
  date: string | null;
  created_by: string;
  created_at: string | null;
  updated_at: string | null;
};

export type Transaction = TransactionRow & {
  category: TransactionCategorySummary | null;
};

export type CampaignStatus = "draft" | "scheduled" | "sent" | "cancelled";

export type CampaignSegmentType =
  | "treatment_type"
  | "visit_count"
  | "last_visit_date"
  | "age_range"
  | "custom_filter";

export type CampaignRecipientStatus = "pending" | "sent" | "failed";

export type CampaignTemplateApprovalStatus =
  "pending" | "approved" | "rejected";

export type CampaignTemplate = {
  id: string;
  clinic_id: string;
  name: string;
  title: string | null;
  content: string;
  footer: string | null;
  image_url: string | null;
  meta_template_name: string | null;
  approval_status: CampaignTemplateApprovalStatus | null;
  variables: Record<string, string> | null;
  created_at: string;
  updated_at: string;
};

export type Campaign = {
  id: string;
  clinic_id: string;
  title: string;
  content: string;
  footer_text: string | null;
  footer_website: string | null;
  footer_phone: string | null;
  image_url: string | null;
  status: CampaignStatus;
  scheduled_at: string | null;
  sent_at: string | null;
  template_id: string | null;
  variable_values: Record<string, string> | null;
  created_at: string;
  updated_at: string;
};

export type CampaignSegment = {
  id: string;
  campaign_id: string;
  segment_type: CampaignSegmentType;
  config: Record<string, unknown>;
  created_at: string;
};

export type CampaignRecipient = {
  id: string;
  campaign_id: string;
  patient_id: string;
  phone: string;
  status: CampaignRecipientStatus;
  sent_at: string | null;
  error_message: string | null;
  provider_message_id: string | null;
  opened_at: string | null;
  clicked_at: string | null;
  created_at: string;
};

export type CampaignRecipientWithPatient = CampaignRecipient & {
  patients: Pick<Patient, "id" | "full_name"> | null;
};

export type AppointmentWithRelations = Appointment & {
  patients: Pick<Patient, "id" | "full_name" | "phone" | "avatar_url"> | null;
  employees: Pick<
    Employee,
    "id" | "full_name" | "color" | "specialty" | "role" | "avatar_url"
  > | null;
  appointment_treatments: (AppointmentTreatment & {
    treatment:
      | (Pick<
          Treatment,
          "id" | "name" | "color" | "price" | "duration_minutes"
        > & {
          treatment_inventory_items?: AppointmentTreatmentInventoryItemWithStock[];
        })
      | null;
  })[];
  appointment_inventory_items?: AppointmentInventoryItemWithStock[];
};

export type InventoryMovementWithEmployee = InventoryMovement & {
  employees: Pick<Employee, "id" | "full_name"> | null;
};

type Tables = {
  clinics: { Row: Clinic; Insert: Partial<Clinic>; Update: Partial<Clinic> };
  clinic_memberships: {
    Row: ClinicMembership;
    Insert: Partial<ClinicMembership>;
    Update: Partial<ClinicMembership>;
  };
  invitation_tokens: {
    Row: InvitationToken;
    Insert: Partial<InvitationToken>;
    Update: Partial<InvitationToken>;
  };
  employees: {
    Row: Employee;
    Insert: Partial<Employee>;
    Update: Partial<Employee>;
  };
  patients: {
    Row: Patient;
    Insert: Partial<Patient>;
    Update: Partial<Patient>;
  };
  treatment: {
    Row: Treatment;
    Insert: Partial<Treatment>;
    Update: Partial<Treatment>;
  };
  treatment_inventory_items: {
    Row: TreatmentInventoryItem;
    Insert: Partial<TreatmentInventoryItem>;
    Update: Partial<TreatmentInventoryItem>;
  };
  appointments: {
    Row: Appointment;
    Insert: Partial<Appointment>;
    Update: Partial<Appointment>;
  };
  appointment_treatments: {
    Row: AppointmentTreatment;
    Insert: Partial<AppointmentTreatment>;
    Update: Partial<AppointmentTreatment>;
  };
  appointment_inventory_items: {
    Row: AppointmentInventoryItem;
    Insert: Partial<AppointmentInventoryItem>;
    Update: Partial<AppointmentInventoryItem>;
  };
  inventory_items: {
    Row: InventoryItem;
    Insert: Partial<InventoryItem>;
    Update: Partial<InventoryItem>;
  };
  inventory_movements: {
    Row: InventoryMovement;
    Insert: Partial<InventoryMovement>;
    Update: Partial<InventoryMovement>;
  };
  transaction_categories: {
    Row: TransactionCategory;
    Insert: Partial<TransactionCategory>;
    Update: Partial<TransactionCategory>;
  };
  transactions: {
    Row: TransactionRow;
    Insert: Partial<TransactionRow>;
    Update: Partial<TransactionRow>;
  };
  campaigns: {
    Row: Campaign;
    Insert: Partial<Campaign>;
    Update: Partial<Campaign>;
  };
  campaign_templates: {
    Row: CampaignTemplate;
    Insert: Partial<CampaignTemplate>;
    Update: Partial<CampaignTemplate>;
  };
  campaign_segments: {
    Row: CampaignSegment;
    Insert: Partial<CampaignSegment>;
    Update: Partial<CampaignSegment>;
  };
  campaign_recipients: {
    Row: CampaignRecipient;
    Insert: Partial<CampaignRecipient>;
    Update: Partial<CampaignRecipient>;
  };
};

export type Database = {
  public: {
    Tables: Tables;
    Views: Record<string, never>;
    Functions: {
      delete_appointment: {
        Args: {
          p_appointment_id: string;
          p_restore_stock?: boolean;
        };
        Returns: undefined;
      };
      campaign_patients_for_campaign: {
        Args: {
          p_campaign_id: string;
        };
        Returns: {
          id: string;
          full_name: string;
          phone: string;
          visit_count: number;
          last_visit_at: string | null;
        }[];
      };
      campaign_segment_patients: {
        Args: {
          p_clinic_id: string;
          p_treatment_id?: string | null;
          p_min_visits?: number | null;
          p_max_visits?: number | null;
          p_months_since_last_visit?: number | null;
          p_min_age?: number | null;
          p_max_age?: number | null;
        };
        Returns: {
          id: string;
          full_name: string;
          phone: string;
          visit_count: number;
          last_visit_at: string | null;
        }[];
      };
    };
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
