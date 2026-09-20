export type EmployeeRole = "admin" | "reception" | "doctor" | "auxiliary";

export type EmployeeAccountType = "internal" | "external";

export type BillingStatus =
  | "not_started"
  | "incomplete"
  | "incomplete_expired"
  | "trialing"
  | "active"
  | "past_due"
  | "canceled"
  | "unpaid"
  | "paused";

export type ClinicBilling = {
  clinic_id: string;
  billing_exempt: boolean;
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  subscription_status: BillingStatus;
  trial_ends_at: string | null;
  current_period_ends_at: string | null;
  cancel_at_period_end: boolean;
  last_stripe_event_id: string | null;
  last_stripe_event_created_at: string | null;
  created_at: string;
  updated_at: string;
};

export type ClinicBillingSummary = Pick<
  ClinicBilling,
  | "clinic_id"
  | "billing_exempt"
  | "subscription_status"
  | "trial_ends_at"
  | "current_period_ends_at"
  | "cancel_at_period_end"
  | "updated_at"
>;

export type ClinicMembershipRole = "owner" | "admin" | "employee" | "external";

export type ClinicMembershipInvitationRole = Exclude<
  ClinicMembershipRole,
  "owner"
>;

export type ClinicMembershipStatus = "pending" | "active" | "suspended";

export type InvitationTokenRole = "admin" | "employee" | "external";

export type AppointmentStatus =
  | "scheduled"
  | "pending_external"
  | "rejected_external"
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

export type ClinicNotificationType =
  | "external_appointment_pending"
  | "external_appointment_accepted"
  | "external_appointment_rejected"
  | "external_appointment_cancelled";

export type ClinicNotification = {
  id: string;
  clinic_id: string;
  recipient_id: string;
  type: ClinicNotificationType;
  appointment_id: string | null;
  starts_at: string;
  read_at: string | null;
  resolved_at: string | null;
  created_at: string;
  updated_at: string;
};

export type ClinicNotificationWithClinic = ClinicNotification & {
  clinics: Pick<Clinic, "name"> | null;
};

export type ExternalAppointmentResponseInput = {
  appointmentId: string;
  decision: "accept" | "reject";
  allowOverlap: boolean;
  expectedUpdatedAt: string;
};

export type ExternalAppointmentResponseResult =
  | { outcome: "accepted" | "rejected"; appointment: Appointment }
  | {
      outcome: "overlap";
      appointmentUpdatedAt: string;
      conflict: {
        clinicName: string;
        startsAt: string;
        endsAt: string;
      };
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
  created_at: string | null;
  updated_at: string | null;
};

export type WhatsAppConfig = {
  clinic_id: string;
  reminder_enabled: boolean;
  reminder_hours: number[];
  phone_number_id: string | null;
  message_template: string;
  confirmation_enabled: boolean;
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

/**
 * Estado de una cita tal y como lo ve el paciente que abre el enlace de
 * confirmación. Lo calcula `appointment_confirmation_state` en la base de
 * datos: el orden de los casos es la regla de negocio, así que no se
 * reconstruye aquí.
 */
export type AppointmentConfirmationState =
  | "confirmable"
  | "already_confirmed"
  | "cancelled"
  | "closed"
  | "past"
  | "expired";

export type AppointmentConfirmationToken = {
  id: string;
  token: string;
  appointment_id: string;
  clinic_id: string;
  expires_at: string;
  confirmed_at: string | null;
  created_at: string;
};

/** Lo mínimo que se le enseña a quien abre el enlace. Sin apellidos, teléfono
 * ni tratamiento: el enlace viaja por WhatsApp y se reenvía. */
export type AppointmentConfirmationView = {
  state: AppointmentConfirmationState;
  patient_first_name: string;
  clinic_name: string;
  clinic_phone: string | null;
  clinic_timezone: string;
  employee_name: string;
  starts_at: string;
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
  created_at: string;
  expires_at: string;
  used_at: string | null;
  used_by: string | null;
};

export type PendingEmployeeInvitation = Pick<
  InvitationToken,
  "id" | "email" | "role" | "created_at" | "expires_at"
>;

export type Employee = {
  id: string;
  account_type: EmployeeAccountType;
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

export type TreatmentRow = Omit<Treatment, "price">;

export type TreatmentPrice = {
  treatment_id: string;
  price: number | null;
  updated_at: string;
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
  price_at_booking: number | null;
  created_at: string | null;
};

export type AppointmentTreatmentRow = Omit<
  AppointmentTreatment,
  "price_at_booking"
>;

export type AppointmentTreatmentPrice = {
  appointment_treatment_id: string;
  price_at_booking: number;
  created_at: string;
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

export type CampaignStatus =
  "draft" | "scheduled" | "sending" | "sent" | "cancelled";

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
  send_started_at: string | null;
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

export type GoogleCalendarConnectionStatus = "active" | "needs_reauth";

/*
 * Solo las columnas que el navegador puede leer: el resto de la tabla
 * —el puntero al token en Vault y `last_error`— está revocado para
 * `authenticated`, así que pedirlas desde el cliente devuelve un error.
 */
export type GoogleCalendarConnection = {
  employee_id: string;
  google_email: string;
  calendar_id: string | null;
  status: GoogleCalendarConnectionStatus;
  last_sync_at: string | null;
  created_at: string;
  updated_at: string;
};

type Tables = {
  clinics: { Row: Clinic; Insert: Partial<Clinic>; Update: Partial<Clinic> };
  google_calendar_connections: {
    Row: GoogleCalendarConnection;
    Insert: Partial<GoogleCalendarConnection>;
    Update: Partial<GoogleCalendarConnection>;
  };
  clinic_billing: {
    Row: ClinicBilling;
    Insert: Partial<ClinicBilling>;
    Update: Partial<ClinicBilling>;
  };
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
    Row: TreatmentRow;
    Insert: Partial<TreatmentRow>;
    Update: Partial<TreatmentRow>;
  };
  treatment_prices: {
    Row: TreatmentPrice;
    Insert: Partial<TreatmentPrice>;
    Update: Partial<TreatmentPrice>;
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
  clinic_notifications: {
    Row: ClinicNotification;
    Insert: Partial<ClinicNotification>;
    Update: Partial<ClinicNotification>;
  };
  appointment_treatments: {
    Row: AppointmentTreatmentRow;
    Insert: Partial<AppointmentTreatmentRow>;
    Update: Partial<AppointmentTreatmentRow>;
  };
  appointment_treatment_prices: {
    Row: AppointmentTreatmentPrice;
    Insert: Partial<AppointmentTreatmentPrice>;
    Update: Partial<AppointmentTreatmentPrice>;
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
  appointment_confirmation_tokens: {
    Row: AppointmentConfirmationToken;
    Insert: Partial<AppointmentConfirmationToken>;
    Update: Partial<AppointmentConfirmationToken>;
  };
};

export type Database = {
  public: {
    Tables: {
      [Name in keyof Tables]: Tables[Name] & { Relationships: [] };
    };
    Views: Record<string, never>;
    Functions: {
      apply_stripe_billing_event: {
        Args: {
          p_event_id: string;
          p_event_type: string;
          p_event_created_at: string;
          p_clinic_id: string;
          p_stripe_customer_id: string | null;
          p_stripe_subscription_id: string | null;
          p_subscription_status: BillingStatus;
          p_trial_ends_at: string | null;
          p_current_period_ends_at: string | null;
          p_cancel_at_period_end: boolean;
        };
        Returns: boolean;
      };
      claim_calendar_sync_batch: {
        Args: {
          p_limit?: number;
          p_max_attempts?: number;
        };
        Returns: {
          id: number;
          appointment_id: string;
          employee_id: string;
          operation: "upsert" | "delete";
          payload: Record<string, unknown>;
          attempts: number;
          calendar_id: string | null;
          connection_status: GoogleCalendarConnectionStatus | null;
          google_event_id: string | null;
          clinic_name: string | null;
        }[];
      };
      complete_calendar_sync: {
        Args: {
          p_id: number;
          p_google_event_id?: string | null;
          p_removed?: boolean;
        };
        Returns: undefined;
      };
      fail_calendar_sync: {
        Args: { p_id: number; p_error: string };
        Returns: undefined;
      };
      mark_google_calendar_needs_reauth: {
        Args: { p_employee_id: string; p_error: string };
        Returns: undefined;
      };
      store_google_calendar_connection: {
        Args: {
          p_employee_id: string;
          p_google_email: string;
          p_refresh_token: string;
          p_granted_scopes: string[];
        };
        Returns: undefined;
      };
      google_calendar_refresh_token: {
        Args: { p_employee_id: string };
        Returns: string | null;
      };
      delete_google_calendar_connection: {
        Args: { p_employee_id: string };
        Returns: undefined;
      };
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
      get_campaign_quota: {
        Args: {
          p_clinic_id: string;
        };
        Returns: {
          used: number;
          campaign_limit: number;
          reached: boolean;
        }[];
      };
      claim_campaign_send_slot: {
        Args: {
          p_campaign_id: string;
        };
        Returns: string;
      };
      get_appointment_confirmation: {
        Args: {
          p_token: string;
        };
        Returns: AppointmentConfirmationView[];
      };
      confirm_appointment_by_token: {
        Args: {
          p_token: string;
        };
        Returns: AppointmentConfirmationView[];
      };
      respond_external_appointment: {
        Args: {
          p_appointment_id: string;
          p_clinic_id: string;
          p_decision: "accept" | "reject";
          p_allow_overlap: boolean;
          p_expected_updated_at: string;
        };
        Returns: ExternalAppointmentResponseResult;
      };
    };
    Enums: {
      employee_role: EmployeeRole;
      employee_account_type: EmployeeAccountType;
      clinic_membership_role: ClinicMembershipRole;
      clinic_membership_status: ClinicMembershipStatus;
      invitation_token_role: InvitationTokenRole;
      appointment_status: AppointmentStatus;
      inventory_movement_type: InventoryMovementType;
      transaction_type: TransactionType;
      patient_image_phase: PatientImagePhase;
      patient_file_category: PatientFileCategory;
      appointment_reminder_status: AppointmentReminderStatus;
      clinic_notification_type: ClinicNotificationType;
      campaign_template_approval_status: CampaignTemplateApprovalStatus;
      campaign_status: CampaignStatus;
      campaign_segment_type: CampaignSegmentType;
      campaign_recipient_status: CampaignRecipientStatus;
      billing_status: BillingStatus;
      google_calendar_connection_status: GoogleCalendarConnectionStatus;
    };
    CompositeTypes: Record<string, never>;
  };
};
