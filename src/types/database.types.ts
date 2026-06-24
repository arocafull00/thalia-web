export type EmployeeRole = "admin" | "reception" | "doctor" | "auxiliary";

export type ClinicMembershipRole = "owner" | "admin" | "employee" | "external";

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

export type TransactionType = "income" | "expense";

export type Clinic = {
  id: string;
  name: string;
  address: string | null;
  phone: string | null;
  owner_id: string | null;
  logo_url: string | null;
  specialty: string | null;
  created_at: string | null;
  updated_at: string | null;
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
  created_at: string | null;
  updated_at: string | null;
};

export type TreatmentType = {
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

export type TreatmentTypeInventoryItem = {
  id: string;
  treatment_type_id: string;
  inventory_item_id: string;
  quantity: number;
  created_at: string | null;
};

export type TreatmentTypeWithInventory = TreatmentType & {
  treatment_type_inventory_items: (TreatmentTypeInventoryItem & {
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
  treatment_type_id: string;
  price_at_booking: number;
  created_at: string | null;
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
  created_at: string | null;
  updated_at: string | null;
};

export type InventoryMovement = {
  id: string;
  item_id: string;
  employee_id: string;
  type: InventoryMovementType;
  quantity: number;
  notes: string | null;
  created_at: string | null;
};

export type Transaction = {
  id: string;
  clinic_id: string;
  appointment_id: string | null;
  type: TransactionType;
  category: string | null;
  amount: number;
  description: string | null;
  date: string | null;
  created_by: string;
  created_at: string | null;
  updated_at: string | null;
};

export type AppointmentWithRelations = Appointment & {
  patients: Pick<Patient, "id" | "full_name" | "phone" | "avatar_url"> | null;
  employees: Pick<Employee, "id" | "full_name" | "color" | "specialty" | "role"> | null;
  appointment_treatments: (AppointmentTreatment & {
    treatment_types: Pick<
      TreatmentType,
      "id" | "name" | "color" | "price" | "duration_minutes"
    > | null;
  })[];
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
  employees: { Row: Employee; Insert: Partial<Employee>; Update: Partial<Employee> };
  patients: { Row: Patient; Insert: Partial<Patient>; Update: Partial<Patient> };
  treatment_types: {
    Row: TreatmentType;
    Insert: Partial<TreatmentType>;
    Update: Partial<TreatmentType>;
  };
  treatment_type_inventory_items: {
    Row: TreatmentTypeInventoryItem;
    Insert: Partial<TreatmentTypeInventoryItem>;
    Update: Partial<TreatmentTypeInventoryItem>;
  };
  appointments: { Row: Appointment; Insert: Partial<Appointment>; Update: Partial<Appointment> };
  appointment_treatments: {
    Row: AppointmentTreatment;
    Insert: Partial<AppointmentTreatment>;
    Update: Partial<AppointmentTreatment>;
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
  transactions: { Row: Transaction; Insert: Partial<Transaction>; Update: Partial<Transaction> };
};

export type Database = {
  public: {
    Tables: Tables;
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
