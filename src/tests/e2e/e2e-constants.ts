export const E2E_USER = {
  email: "e2e@landora.test",
  password: "LandoraE2E123!",
} as const;

export const E2E_DATA = {
  clinicId: "10000000-0000-4000-8000-000000000001",
  clinic: "Clínica E2E",
  employee: "E2E Administrador",
  patient: "E2E Paciente Base",
  filterPatient: "E2E Paciente Filtro",
  treatment: "E2E Tratamiento Facial",
  treatmentId: "40000000-0000-4000-8000-000000000001",
  patientId: "30000000-0000-4000-8000-000000000001",
  inventoryItemId: "50000000-0000-4000-8000-000000000001",
  inventoryItemName: "E2E Material Facial",
} as const;

export const E2E_TINY_PNG = Buffer.from(
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAusB9Wl2nWQAAAAASUVORK5CYII=",
  "base64",
);
