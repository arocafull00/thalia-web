export const CLINIC_ID = "00000000-0000-0000-0000-000000000001";
export const PATIENT_ID = "00000000-0000-0000-0000-000000000002";
export const EMPLOYEE_ID = "00000000-0000-0000-0000-000000000003";
export const TREATMENT_ID = "00000000-0000-0000-0000-000000000004";
export const ITEM_ID = "00000000-0000-0000-0000-000000000005";
export const APPOINTMENT_ID = "00000000-0000-0000-0000-000000000006";

export const mockEmployee = {
  id: EMPLOYEE_ID,
  full_name: "Ana García",
  phone: null,
  specialty: null,
  color: "#6366f1",
  avatar_url: null,
  role: "owner",
  clinic_id: CLINIC_ID,
  email: "ana@clinic.com",
  created_at: "2024-01-01T00:00:00Z",
  updated_at: "2024-01-01T00:00:00Z",
};

export const mockPatient = {
  id: PATIENT_ID,
  clinic_id: CLINIC_ID,
  full_name: "Carlos López",
  dni: null,
  birth_date: null,
  phone: null,
  email: null,
  address: null,
  notes: null,
  avatar_url: null,
  created_at: "2024-01-01T00:00:00Z",
  updated_at: "2024-01-01T00:00:00Z",
};

export const mockInventoryItem = {
  id: ITEM_ID,
  clinic_id: CLINIC_ID,
  name: "Jeringuilla",
  category: "Material",
  unit: "ud",
  stock: 10,
  min_stock: 5,
  unit_price: 0.5,
  created_at: "2024-01-01T00:00:00Z",
  updated_at: "2024-01-01T00:00:00Z",
};

export const mockAppointment = {
  id: APPOINTMENT_ID,
  clinic_id: CLINIC_ID,
  patient_id: PATIENT_ID,
  employee_id: EMPLOYEE_ID,
  starts_at: "2030-06-01T10:00:00Z",
  ends_at: "2030-06-01T11:00:00Z",
  status: "scheduled" as const,
  notes: null,
  created_at: "2024-01-01T00:00:00Z",
  updated_at: "2024-01-01T00:00:00Z",
};

export const mockTreatment = {
  id: TREATMENT_ID,
  clinic_id: CLINIC_ID,
  name: "Limpieza",
  price: 50,
  duration_minutes: 60,
  color: "#6366f1",
  created_at: "2024-01-01T00:00:00Z",
  updated_at: "2024-01-01T00:00:00Z",
};
