import { randomBytes, randomUUID } from "node:crypto";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { createClient } from "@supabase/supabase-js";
import { fromZonedTime } from "date-fns-tz";

const CONFIRMATION = "RESET_ALL_SUPABASE_DATA";
const APPOINTMENTS_PER_DAY = 20;
const DEFAULT_APPOINTMENT_DAYS = 30;
const PATIENT_COUNT = 120;
const FINANCE_WEEKDAY_COUNT = 22;
const STORAGE_PAGE_SIZE = 1000;
const DELETE_BATCH_SIZE = 10;
const INSERT_BATCH_SIZE = 500;
const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = join(__dirname, "..");
const environmentFilePath = join(projectRoot, ".env");
const linkedProjectRefPath = join(
  projectRoot,
  "supabase",
  ".temp",
  "project-ref",
);

const publicTablesDeleteOrder = [
  "appointment_inventory_items",
  "appointment_reminders",
  "appointment_treatments",
  "campaign_recipients",
  "campaign_segments",
  "inventory_alerts",
  "inventory_movements",
  "patient_files",
  "patient_images",
  "transactions",
  "treatment_inventory_items",
  "appointments",
  "campaigns",
  "campaign_templates",
  "patients",
  "transaction_categories",
  "inventory_items",
  "treatment",
  "clinic_memberships",
  "invitation_tokens",
  "employees",
  "clinics",
];

const clinicDefinitions = [
  {
    key: "dental",
    adminEmailEnvironment: "SEED_DENTAL_ADMIN_EMAIL",
    adminPasswordEnvironment: "SEED_DENTAL_ADMIN_PASSWORD",
    clinicNameEnvironment: "SEED_DENTAL_CLINIC_NAME",
    defaultName: "Clínica Dental Thalia",
    admin: {
      fullName: "Elena Ruiz",
      specialty: "Dirección odontológica",
      color: "#1d4ed8",
      phone: "+34611000100",
    },
    address: "Calle Velázquez 84, Madrid",
    phone: "+34911000100",
    specialty: "Odontología integral",
    openingTime: "08:30",
    closingTime: "19:30",
    patientPhonePrefix: "+34621",
    patientNote: "Paciente con seguimiento odontológico periódico.",
    appointmentNote: "Cita odontológica programada.",
    employees: [
      {
        emailPrefix: "dental.recepcion",
        fullName: "Lucía Martín",
        role: "reception",
        specialty: "Recepción dental",
        color: "#0f766e",
        phone: "+34611000101",
      },
      {
        emailPrefix: "dental.ines",
        fullName: "Inés Romero",
        role: "doctor",
        specialty: "Odontología general",
        color: "#2563eb",
        phone: "+34611000102",
      },
      {
        emailPrefix: "dental.pablo",
        fullName: "Pablo Navarro",
        role: "doctor",
        specialty: "Ortodoncia",
        color: "#7c3aed",
        phone: "+34611000103",
      },
      {
        emailPrefix: "dental.marta",
        fullName: "Marta Vega",
        role: "doctor",
        specialty: "Periodoncia",
        color: "#c2410c",
        phone: "+34611000104",
      },
      {
        emailPrefix: "dental.sergio",
        fullName: "Sergio Santos",
        role: "doctor",
        specialty: "Implantología",
        color: "#be123c",
        phone: "+34611000105",
      },
      {
        emailPrefix: "dental.auxiliar",
        fullName: "Carla Ortega",
        role: "auxiliary",
        specialty: "Higiene bucodental",
        color: "#4d7c0f",
        phone: "+34611000106",
      },
    ],
    inventory: [
      {
        key: "anestesia",
        name: "Anestesia local",
        category: "Anestesia",
        unit: "cartucho",
        stock: 500,
        min_stock: 100,
        unit_price: 1.8,
      },
      {
        key: "composite",
        name: "Composite dental",
        category: "Restauración",
        unit: "jeringa",
        stock: 120,
        min_stock: 25,
        unit_price: 22,
      },
      {
        key: "profilaxis",
        name: "Cepillo de profilaxis",
        category: "Higiene",
        unit: "unidad",
        stock: 400,
        min_stock: 80,
        unit_price: 0.75,
      },
      {
        key: "blanqueamiento",
        name: "Kit de blanqueamiento",
        category: "Estética dental",
        unit: "kit",
        stock: 80,
        min_stock: 15,
        unit_price: 38,
      },
    ],
    treatments: [
      {
        name: "Revisión dental",
        category: "Diagnóstico",
        duration_minutes: 30,
        color: "#2563eb",
        price: 45,
        materials: [],
      },
      {
        name: "Limpieza dental",
        category: "Higiene",
        duration_minutes: 45,
        color: "#0f766e",
        price: 70,
        materials: [{ key: "profilaxis", quantity: 1 }],
      },
      {
        name: "Empaste",
        category: "Odontología conservadora",
        duration_minutes: 60,
        color: "#7c3aed",
        price: 110,
        materials: [
          { key: "anestesia", quantity: 1 },
          { key: "composite", quantity: 0.1 },
        ],
      },
      {
        name: "Endodoncia",
        category: "Endodoncia",
        duration_minutes: 60,
        color: "#c2410c",
        price: 260,
        materials: [{ key: "anestesia", quantity: 2 }],
      },
      {
        name: "Blanqueamiento dental",
        category: "Estética dental",
        duration_minutes: 60,
        color: "#be123c",
        price: 295,
        materials: [{ key: "blanqueamiento", quantity: 1 }],
      },
      {
        name: "Revisión de ortodoncia",
        category: "Ortodoncia",
        duration_minutes: 30,
        color: "#4d7c0f",
        price: 65,
        materials: [],
      },
    ],
  },
  {
    key: "estetica",
    adminEmailEnvironment: "SEED_AESTHETIC_ADMIN_EMAIL",
    adminPasswordEnvironment: "SEED_AESTHETIC_ADMIN_PASSWORD",
    clinicNameEnvironment: "SEED_AESTHETIC_CLINIC_NAME",
    defaultName: "Clínica Estética Thalia",
    admin: {
      fullName: "Marina López",
      specialty: "Dirección médica estética",
      color: "#9333ea",
      phone: "+34612000100",
    },
    address: "Calle Serrano 120, Madrid",
    phone: "+34912000100",
    specialty: "Medicina estética y dermatología",
    openingTime: "09:00",
    closingTime: "19:00",
    patientPhonePrefix: "+34622",
    patientNote: "Paciente con seguimiento de medicina estética.",
    appointmentNote: "Cita de medicina estética programada.",
    employees: [
      {
        emailPrefix: "estetica.recepcion",
        fullName: "Nuria Campos",
        role: "reception",
        specialty: "Recepción estética",
        color: "#0f766e",
        phone: "+34612000101",
      },
      {
        emailPrefix: "estetica.alba",
        fullName: "Alba Romero",
        role: "doctor",
        specialty: "Medicina estética facial",
        color: "#2563eb",
        phone: "+34612000102",
      },
      {
        emailPrefix: "estetica.daniel",
        fullName: "Daniel Navarro",
        role: "doctor",
        specialty: "Dermatología",
        color: "#7c3aed",
        phone: "+34612000103",
      },
      {
        emailPrefix: "estetica.sofia",
        fullName: "Sofía Vega",
        role: "doctor",
        specialty: "Medicina estética corporal",
        color: "#c2410c",
        phone: "+34612000104",
      },
      {
        emailPrefix: "estetica.mateo",
        fullName: "Mateo Santos",
        role: "doctor",
        specialty: "Tratamientos láser",
        color: "#be123c",
        phone: "+34612000105",
      },
      {
        emailPrefix: "estetica.auxiliar",
        fullName: "Eva Molina",
        role: "auxiliary",
        specialty: "Auxiliar de medicina estética",
        color: "#4d7c0f",
        phone: "+34612000106",
      },
    ],
    inventory: [
      {
        key: "toxina",
        name: "Toxina botulínica",
        category: "Inyectables",
        unit: "vial",
        stock: 100,
        min_stock: 20,
        unit_price: 115,
      },
      {
        key: "hialuronico",
        name: "Ácido hialurónico",
        category: "Inyectables",
        unit: "jeringa",
        stock: 140,
        min_stock: 30,
        unit_price: 92,
      },
      {
        key: "peeling",
        name: "Solución para peeling",
        category: "Facial",
        unit: "aplicación",
        stock: 180,
        min_stock: 35,
        unit_price: 14,
      },
      {
        key: "gel_laser",
        name: "Gel conductor láser",
        category: "Láser",
        unit: "botella",
        stock: 90,
        min_stock: 20,
        unit_price: 12,
      },
    ],
    treatments: [
      {
        name: "Consulta estética",
        category: "Consulta",
        duration_minutes: 30,
        color: "#2563eb",
        price: 60,
        materials: [],
      },
      {
        name: "Higiene facial profunda",
        category: "Facial",
        duration_minutes: 60,
        color: "#0f766e",
        price: 95,
        materials: [],
      },
      {
        name: "Toxina botulínica",
        category: "Medicina estética",
        duration_minutes: 45,
        color: "#7c3aed",
        price: 290,
        materials: [{ key: "toxina", quantity: 1 }],
      },
      {
        name: "Ácido hialurónico",
        category: "Medicina estética",
        duration_minutes: 60,
        color: "#c2410c",
        price: 360,
        materials: [{ key: "hialuronico", quantity: 1 }],
      },
      {
        name: "Peeling químico",
        category: "Facial",
        duration_minutes: 45,
        color: "#be123c",
        price: 125,
        materials: [{ key: "peeling", quantity: 1 }],
      },
      {
        name: "Tratamiento láser",
        category: "Láser",
        duration_minutes: 60,
        color: "#4d7c0f",
        price: 175,
        materials: [{ key: "gel_laser", quantity: 0.1 }],
      },
    ],
  },
];

const firstNames = [
  "Alejandro",
  "Beatriz",
  "Carlos",
  "Diana",
  "Elena",
  "Fernando",
  "Gabriela",
  "Hugo",
  "Inés",
  "Javier",
  "Laura",
  "Miguel",
  "Natalia",
  "Óscar",
  "Paula",
  "Raúl",
  "Sara",
  "Tomás",
  "Valeria",
  "Yolanda",
];

const expenseSeedDefinitions = [
  {
    categoryName: "Nóminas",
    amount: 4200,
    description: "Nóminas del mes",
  },
  {
    categoryName: "Alquiler",
    amount: 1800,
    description: "Alquiler del local",
  },
  {
    categoryName: "Marketing",
    amount: 350,
    description: "Campaña en redes sociales",
  },
  {
    categoryName: "Material sanitario",
    amount: 620,
    description: "Reposición de material",
  },
];

const lastNames = [
  "Alonso",
  "Blanco",
  "Castro",
  "Domínguez",
  "Esteban",
  "Fernández",
  "García",
  "Hernández",
  "Iglesias",
  "Jiménez",
  "López",
  "Martínez",
];

function getArgument(name) {
  const index = process.argv.indexOf(name);
  return index === -1 ? null : (process.argv[index + 1] ?? null);
}

function writeOutput(message) {
  process.stdout.write(`${message}\n`);
}

function loadEnvironmentFile() {
  let contents;

  try {
    contents = readFileSync(environmentFilePath, "utf8");
  } catch {
    return;
  }

  for (const line of contents.split("\n")) {
    const trimmed = line.trim();

    if (!trimmed || trimmed.startsWith("#")) {
      continue;
    }

    const separatorIndex = trimmed.indexOf("=");

    if (separatorIndex === -1) {
      continue;
    }

    const key = trimmed.slice(0, separatorIndex).trim();
    let value = trimmed.slice(separatorIndex + 1).trim();

    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    if (!(key in process.env)) {
      process.env[key] = value;
    }
  }
}

function readRequiredEnvironment(name, fallbackName) {
  const value =
    process.env[name] ?? (fallbackName ? process.env[fallbackName] : undefined);

  if (!value?.trim()) {
    const suffix = fallbackName ? ` o ${fallbackName}` : "";
    throw new Error(`Falta la variable ${name}${suffix}`);
  }

  return value.trim();
}

function parsePositiveInteger(value, name) {
  const parsed = Number.parseInt(value, 10);

  if (!Number.isInteger(parsed) || parsed < 1 || parsed > 365) {
    throw new Error(`${name} debe ser un entero entre 1 y 365`);
  }

  return parsed;
}

function validateEmail(email, name) {
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new Error(`${name} no es un email válido`);
  }
}

function getProjectRefFromUrl(url) {
  const parsedUrl = new URL(url);
  const [projectRef] = parsedUrl.hostname.split(".");

  if (!projectRef || parsedUrl.hostname === "localhost") {
    throw new Error("SUPABASE_URL debe apuntar al proyecto remoto de Supabase");
  }

  return projectRef;
}

function loadConfiguration() {
  const confirmation = getArgument("--confirm");

  if (confirmation !== CONFIRMATION) {
    throw new Error(
      `Operación cancelada. Añade --confirm ${CONFIRMATION} para autorizarla`,
    );
  }

  const expectedProjectRef = getArgument("--project-ref");

  if (!expectedProjectRef) {
    throw new Error(
      "Falta --project-ref con la referencia exacta del proyecto",
    );
  }

  const supabaseUrl = readRequiredEnvironment(
    "SUPABASE_URL",
    "NEXT_PUBLIC_SUPABASE_URL",
  );
  const supabaseSecretKey = readRequiredEnvironment(
    "SUPABASE_SECRET_KEY",
    "SUPABASE_SERVICE_ROLE_KEY",
  );
  const sharedAdminPassword = process.env.SEED_ADMIN_PASSWORD?.trim();
  const emailDomain = (process.env.SEED_EMAIL_DOMAIN ?? "thalia.test")
    .trim()
    .toLowerCase();
  const appointmentDays = parsePositiveInteger(
    process.env.SEED_APPOINTMENT_DAYS ?? String(DEFAULT_APPOINTMENT_DAYS),
    "SEED_APPOINTMENT_DAYS",
  );
  const projectRefFromUrl = getProjectRefFromUrl(supabaseUrl);
  const linkedProjectRef = readFileSync(linkedProjectRefPath, "utf8").trim();
  const clinics = clinicDefinitions.map((definition) => {
    const adminEmail = (
      process.env[definition.adminEmailEnvironment] ??
      `${definition.key}.admin@${emailDomain}`
    )
      .trim()
      .toLowerCase();
    const adminPassword =
      process.env[definition.adminPasswordEnvironment]?.trim() ??
      sharedAdminPassword;
    const clinicName = (
      process.env[definition.clinicNameEnvironment] ?? definition.defaultName
    ).trim();

    validateEmail(adminEmail, definition.adminEmailEnvironment);

    if (!adminPassword || adminPassword.length < 12) {
      throw new Error(
        `${definition.adminPasswordEnvironment} o SEED_ADMIN_PASSWORD debe tener al menos 12 caracteres`,
      );
    }

    return {
      ...definition,
      adminEmail,
      adminPassword,
      clinicName,
    };
  });

  validateEmail(`employee@${emailDomain}`, "SEED_EMAIL_DOMAIN");

  const emails = clinics.flatMap((clinic) => [
    clinic.adminEmail,
    ...clinic.employees.map(
      (employee) => `${employee.emailPrefix}@${emailDomain}`,
    ),
  ]);

  if (new Set(emails).size !== emails.length) {
    throw new Error("Los emails configurados para la seed deben ser únicos");
  }

  if (
    expectedProjectRef !== projectRefFromUrl ||
    expectedProjectRef !== linkedProjectRef
  ) {
    throw new Error(
      `Las referencias no coinciden: argumento=${expectedProjectRef}, url=${projectRefFromUrl}, linked=${linkedProjectRef}`,
    );
  }

  return {
    appointmentDays,
    clinics,
    emailDomain,
    projectRef: expectedProjectRef,
    supabaseSecretKey,
    supabaseUrl,
    timezone: "Europe/Madrid",
  };
}

function createAdminClient(config) {
  return createClient(config.supabaseUrl, config.supabaseSecretKey, {
    auth: {
      autoRefreshToken: false,
      detectSessionInUrl: false,
      persistSession: false,
    },
  });
}

async function runPublicDataReset(adminClient) {
  for (const table of publicTablesDeleteOrder) {
    const { error } = await adminClient
      .from(table)
      .delete()
      .neq("id", "00000000-0000-0000-0000-000000000000");

    if (error) {
      throw new Error(`No se pudo vaciar ${table}: ${error.message}`);
    }
  }
}

function chunk(items, size) {
  const chunks = [];

  for (let index = 0; index < items.length; index += size) {
    chunks.push(items.slice(index, index + size));
  }

  return chunks;
}

async function listBucketFiles(storage, bucketId, prefix = "") {
  const paths = [];
  let offset = 0;

  while (true) {
    const { data, error } = await storage.from(bucketId).list(prefix, {
      limit: STORAGE_PAGE_SIZE,
      offset,
      sortBy: { column: "name", order: "asc" },
    });

    if (error) {
      throw new Error(
        `No se pudo listar Storage ${bucketId}: ${error.message}`,
      );
    }

    for (const item of data) {
      const itemPath = prefix ? `${prefix}/${item.name}` : item.name;

      if (item.id === null || item.metadata === null) {
        paths.push(...(await listBucketFiles(storage, bucketId, itemPath)));
        continue;
      }

      paths.push(itemPath);
    }

    if (data.length < STORAGE_PAGE_SIZE) {
      return paths;
    }

    offset += STORAGE_PAGE_SIZE;
  }
}

async function clearStorage(adminClient) {
  const { data: buckets, error } = await adminClient.storage.listBuckets();

  if (error) {
    throw new Error(`No se pudieron listar los buckets: ${error.message}`);
  }

  let deletedObjects = 0;

  for (const bucket of buckets) {
    const paths = await listBucketFiles(adminClient.storage, bucket.id);

    for (const pathBatch of chunk(paths, 100)) {
      const { error: removeError } = await adminClient.storage
        .from(bucket.id)
        .remove(pathBatch);

      if (removeError) {
        throw new Error(
          `No se pudo vaciar el bucket ${bucket.id}: ${removeError.message}`,
        );
      }

      deletedObjects += pathBatch.length;
    }
  }

  return deletedObjects;
}

async function deleteAllAuthUsers(adminClient) {
  let deletedUsers = 0;

  while (true) {
    const { data, error } = await adminClient.auth.admin.listUsers({
      page: 1,
      perPage: 1000,
    });

    if (error) {
      throw new Error(`No se pudieron listar los usuarios: ${error.message}`);
    }

    if (data.users.length === 0) {
      return deletedUsers;
    }

    for (const userBatch of chunk(data.users, DELETE_BATCH_SIZE)) {
      await Promise.all(
        userBatch.map(async (user) => {
          const { error: deleteError } =
            await adminClient.auth.admin.deleteUser(user.id, false);

          if (deleteError) {
            throw new Error(
              `No se pudo borrar el usuario ${user.id}: ${deleteError.message}`,
            );
          }
        }),
      );
      deletedUsers += userBatch.length;
    }
  }
}

function createTemporaryPassword() {
  return `Ld-${randomBytes(18).toString("base64url")}9!`;
}

async function createAuthUser(adminClient, definition) {
  const { data, error } = await adminClient.auth.admin.createUser({
    email: definition.email,
    password: definition.password,
    email_confirm: true,
    app_metadata: { seeded: true },
    user_metadata: {
      full_name: definition.fullName,
      intended_operational_role: definition.role,
      registration_profile_complete: true,
    },
  });

  if (error || !data.user) {
    throw new Error(
      `No se pudo crear ${definition.email}: ${error?.message ?? "sin usuario"}`,
    );
  }

  return { ...definition, id: data.user.id };
}

async function insertRows(adminClient, table, rows) {
  for (const rowBatch of chunk(rows, INSERT_BATCH_SIZE)) {
    const { error } = await adminClient.from(table).insert(rowBatch);

    if (error) {
      throw new Error(`No se pudo insertar ${table}: ${error.message}`);
    }
  }
}

function getDateInTimeZone(date, timezone) {
  return new Intl.DateTimeFormat("en-CA", {
    day: "2-digit",
    month: "2-digit",
    timeZone: timezone,
    year: "numeric",
  }).format(date);
}

function addCalendarDays(date, days) {
  const result = new Date(date);
  result.setUTCDate(result.getUTCDate() + days);
  return result;
}

function getOpenDates(timezone, count) {
  const dates = [];
  let cursor = addCalendarDays(new Date(), 1);

  while (dates.length < count) {
    const date = getDateInTimeZone(cursor, timezone);
    const dayOfWeek = fromZonedTime(`${date}T12:00:00`, timezone).getDay();

    if (dayOfWeek >= 1 && dayOfWeek <= 5) {
      dates.push(date);
    }

    cursor = addCalendarDays(cursor, 1);
  }

  return dates;
}

function getPastWeekdayDates(timezone, count) {
  const dates = [];
  let cursor = new Date();

  while (dates.length < count) {
    const date = getDateInTimeZone(cursor, timezone);
    const dayOfWeek = fromZonedTime(`${date}T12:00:00`, timezone).getDay();

    if (dayOfWeek >= 1 && dayOfWeek <= 5) {
      dates.unshift(date);
    }

    cursor = addCalendarDays(cursor, -1);
  }

  return dates;
}

function createPatients(clinic, emailDomain) {
  const clinicOffset = clinic.key === "dental" ? 0 : PATIENT_COUNT;

  return Array.from({ length: PATIENT_COUNT }, (_, index) => {
    const firstName = firstNames[index % firstNames.length];
    const lastName = lastNames[Math.floor(index / firstNames.length)];
    const sequence = String(index + 1).padStart(3, "0");
    const globalIndex = clinicOffset + index;
    const birthYear = 1955 + (index % 48);
    const birthMonth = String((index % 12) + 1).padStart(2, "0");
    const birthDay = String((index % 27) + 1).padStart(2, "0");

    return {
      id: randomUUID(),
      clinic_id: clinic.id,
      full_name: `${firstName} ${lastName}`,
      dni: `${String(10000000 + globalIndex)}${"TRWAGMYFPDXBNJZSQVHLCKE"[globalIndex % 23]}`,
      birth_date: `${birthYear}-${birthMonth}-${birthDay}`,
      phone: `${clinic.patientPhonePrefix}${String(index).padStart(6, "0")}`,
      email: `paciente.${clinic.key}.${sequence}@${emailDomain}`,
      address: `Calle Salud ${index + 1}, Madrid`,
      notes: index % 8 === 0 ? clinic.patientNote : null,
      marketing_opt_in: index % 3 !== 0,
    };
  });
}

function createAppointments({
  clinicId,
  dates,
  doctors,
  patients,
  seededTreatments,
  timezone,
  appointmentNote,
}) {
  const appointments = [];
  const appointmentTreatments = [];

  dates.forEach((date, dayIndex) => {
    for (let slot = 0; slot < APPOINTMENTS_PER_DAY; slot += 1) {
      const doctor = doctors[slot % doctors.length];
      const hour = 9 + Math.floor(slot / doctors.length);
      const treatment =
        seededTreatments[
          (dayIndex * APPOINTMENTS_PER_DAY + slot) % seededTreatments.length
        ];
      const patient =
        patients[(dayIndex * APPOINTMENTS_PER_DAY + slot) % patients.length];
      const appointmentId = randomUUID();
      const startsAt = fromZonedTime(
        `${date}T${String(hour).padStart(2, "0")}:00:00`,
        timezone,
      );
      const endsAt = new Date(
        startsAt.getTime() + treatment.duration_minutes * 60_000,
      );

      appointments.push({
        id: appointmentId,
        clinic_id: clinicId,
        patient_id: patient.id,
        employee_id: doctor.id,
        starts_at: startsAt.toISOString(),
        ends_at: endsAt.toISOString(),
        status: slot % 3 === 0 ? "confirmed" : "scheduled",
        notes: `${appointmentNote} ${date}.`,
      });
      appointmentTreatments.push({
        id: randomUUID(),
        appointment_id: appointmentId,
        treatment_id: treatment.id,
        price_at_booking: treatment.price,
      });
    }
  });

  return { appointments, appointmentTreatments };
}

async function fetchTransactionCategories(adminClient, clinicId) {
  const { data, error } = await adminClient
    .from("transaction_categories")
    .select("id, type, name")
    .eq("clinic_id", clinicId);

  if (error || !data) {
    throw new Error(
      `No se pudieron cargar las categorías financieras: ${error?.message ?? "sin datos"}`,
    );
  }

  return new Map(
    data.map((category) => [`${category.type}:${category.name}`, category]),
  );
}

function createTransactions({
  adminId,
  categories,
  clinicId,
  financeDates,
  seededTreatments,
}) {
  const transactions = [];
  const treatmentsCategory = categories.get("income:Tratamientos");
  const productsCategory = categories.get("income:Productos");

  if (!treatmentsCategory || !productsCategory) {
    throw new Error("Faltan categorías financieras por defecto");
  }

  financeDates.forEach((date, index) => {
    const treatment = seededTreatments[index % seededTreatments.length];

    transactions.push({
      id: randomUUID(),
      clinic_id: clinicId,
      appointment_id: null,
      type: "income",
      category_id: treatmentsCategory.id,
      amount: treatment.price,
      description: `Cobro de ${treatment.name.toLowerCase()}`,
      date,
      created_by: adminId,
    });

    if (index % 4 === 0) {
      transactions.push({
        id: randomUUID(),
        clinic_id: clinicId,
        appointment_id: null,
        type: "income",
        category_id: productsCategory.id,
        amount: 35 + (index % 5) * 12,
        description: "Venta de producto en mostrador",
        date,
        created_by: adminId,
      });
    }
  });

  const expenseDates = [
    financeDates.at(-1),
    financeDates.at(-8),
    financeDates.at(-15),
  ].filter(Boolean);

  for (const expenseDate of expenseDates) {
    for (const expense of expenseSeedDefinitions) {
      const category = categories.get(`expense:${expense.categoryName}`);

      if (!category) {
        throw new Error(`Falta la categoría ${expense.categoryName}`);
      }

      transactions.push({
        id: randomUUID(),
        clinic_id: clinicId,
        appointment_id: null,
        type: "expense",
        category_id: category.id,
        amount: expense.amount,
        description: expense.description,
        date: expenseDate,
        created_by: adminId,
      });
    }
  }

  return transactions;
}

async function seedClinic({
  adminClient,
  clinic,
  config,
  createdUserIds,
  dates,
}) {
  const admin = await createAuthUser(adminClient, {
    ...clinic.admin,
    email: clinic.adminEmail,
    password: clinic.adminPassword,
    role: "admin",
  });
  createdUserIds.push(admin.id);

  const employees = [];

  for (const definition of clinic.employees) {
    const employee = await createAuthUser(adminClient, {
      ...definition,
      email: `${definition.emailPrefix}@${config.emailDomain}`,
      password: createTemporaryPassword(),
    });
    createdUserIds.push(employee.id);
    employees.push(employee);
  }

  const clinicId = randomUUID();

  await insertRows(adminClient, "clinics", [
    {
      id: clinicId,
      name: clinic.clinicName,
      address: clinic.address,
      phone: clinic.phone,
      owner_id: admin.id,
      specialty: clinic.specialty,
      opening_time: clinic.openingTime,
      closing_time: clinic.closingTime,
      open_days: [1, 2, 3, 4, 5],
      timezone: config.timezone,
    },
  ]);

  const allUsers = [
    {
      ...admin,
      ...clinic.admin,
    },
    ...employees,
  ];

  await insertRows(
    adminClient,
    "employees",
    allUsers.map((user) => ({
      id: user.id,
      clinic_id: clinicId,
      full_name: user.fullName,
      role: user.role,
      specialty: user.specialty,
      color: user.color,
      phone: user.phone,
      active: true,
    })),
  );

  await insertRows(
    adminClient,
    "clinic_memberships",
    allUsers.map((user) => ({
      id: randomUUID(),
      user_id: user.id,
      clinic_id: clinicId,
      role: user.id === admin.id ? "owner" : "employee",
      status: "active",
      joined_at: new Date().toISOString(),
    })),
  );

  const patients = createPatients({ ...clinic, id: clinicId }, config.emailDomain);
  await insertRows(adminClient, "patients", patients);

  const inventoryItems = clinic.inventory.map((item) => ({
    ...item,
    id: randomUUID(),
    clinic_id: clinicId,
  }));
  await insertRows(
    adminClient,
    "inventory_items",
    inventoryItems.map((item) => ({
      id: item.id,
      clinic_id: item.clinic_id,
      name: item.name,
      category: item.category,
      unit: item.unit,
      stock: item.stock,
      min_stock: item.min_stock,
      unit_price: item.unit_price,
    })),
  );

  const seededTreatments = clinic.treatments.map((treatment) => ({
    ...treatment,
    id: randomUUID(),
    clinic_id: clinicId,
  }));
  await insertRows(
    adminClient,
    "treatment",
    seededTreatments.map((treatment) => ({
      id: treatment.id,
      clinic_id: treatment.clinic_id,
      name: treatment.name,
      category: treatment.category,
      duration_minutes: treatment.duration_minutes,
      color: treatment.color,
      price: treatment.price,
    })),
  );

  const inventoryByKey = new Map(
    inventoryItems.map((item) => [item.key, item]),
  );
  const treatmentInventoryItems = seededTreatments.flatMap((treatment) =>
    treatment.materials.map((material) => {
      const inventoryItem = inventoryByKey.get(material.key);

      if (!inventoryItem) {
        throw new Error(
          `No existe el material ${material.key} de ${treatment.name}`,
        );
      }

      return {
        id: randomUUID(),
        treatment_id: treatment.id,
        inventory_item_id: inventoryItem.id,
        quantity: material.quantity,
      };
    }),
  );
  await insertRows(
    adminClient,
    "treatment_inventory_items",
    treatmentInventoryItems,
  );

  const doctors = employees.filter((employee) => employee.role === "doctor");
  const { appointments, appointmentTreatments } = createAppointments({
    clinicId,
    dates,
    doctors,
    patients,
    seededTreatments,
    timezone: config.timezone,
    appointmentNote: clinic.appointmentNote,
  });

  await insertRows(adminClient, "appointments", appointments);
  await insertRows(
    adminClient,
    "appointment_treatments",
    appointmentTreatments,
  );

  const categories = await fetchTransactionCategories(adminClient, clinicId);
  const financeDates = getPastWeekdayDates(
    config.timezone,
    FINANCE_WEEKDAY_COUNT,
  );
  const transactions = createTransactions({
    adminId: admin.id,
    categories,
    clinicId,
    financeDates,
    seededTreatments,
  });
  await insertRows(adminClient, "transactions", transactions);

  return {
    admin,
    appointmentCount: appointments.length,
    clinicId,
    clinicKey: clinic.key,
    clinicName: clinic.clinicName,
    employees,
    inventoryItemCount: inventoryItems.length,
    patientCount: patients.length,
    transactionCount: transactions.length,
    treatmentInventoryItemCount: treatmentInventoryItems.length,
    treatmentCount: seededTreatments.length,
  };
}

async function seedData(adminClient, config, createdUserIds) {
  const dates = getOpenDates(config.timezone, config.appointmentDays);
  const clinics = [];

  for (const clinic of config.clinics) {
    clinics.push(
      await seedClinic({
        adminClient,
        clinic,
        config,
        createdUserIds,
        dates,
      }),
    );
  }

  return { clinics, dates };
}

async function countRows(adminClient, table) {
  const { count, error } = await adminClient
    .from(table)
    .select("*", { count: "exact", head: true });

  if (error || count === null) {
    throw new Error(
      `No se pudo verificar ${table}: ${error?.message ?? "sin recuento"}`,
    );
  }

  return count;
}

async function verifySeed(adminClient, result) {
  const totals = result.clinics.reduce(
    (accumulator, clinic) => ({
      appointments: accumulator.appointments + clinic.appointmentCount,
      employees: accumulator.employees + clinic.employees.length + 1,
      inventoryItems: accumulator.inventoryItems + clinic.inventoryItemCount,
      patients: accumulator.patients + clinic.patientCount,
      treatmentInventoryItems:
        accumulator.treatmentInventoryItems +
        clinic.treatmentInventoryItemCount,
      transactions: accumulator.transactions + clinic.transactionCount,
      treatments: accumulator.treatments + clinic.treatmentCount,
    }),
    {
      appointments: 0,
      employees: 0,
      inventoryItems: 0,
      patients: 0,
      treatmentInventoryItems: 0,
      transactions: 0,
      treatments: 0,
    },
  );
  const expected = {
    appointments: totals.appointments,
    appointment_treatments: totals.appointments,
    clinic_memberships: totals.employees,
    clinics: result.clinics.length,
    employees: totals.employees,
    inventory_items: totals.inventoryItems,
    patients: totals.patients,
    transaction_categories: result.clinics.length * 6,
    transactions: totals.transactions,
    treatment: totals.treatments,
    treatment_inventory_items: totals.treatmentInventoryItems,
  };
  const actual = {};

  for (const [table, expectedCount] of Object.entries(expected)) {
    actual[table] = await countRows(adminClient, table);

    if (actual[table] !== expectedCount) {
      throw new Error(
        `Verificación fallida en ${table}: esperado=${expectedCount}, actual=${actual[table]}`,
      );
    }
  }

  const { data: authData, error: authError } =
    await adminClient.auth.admin.listUsers({ page: 1, perPage: 1000 });

  if (authError) {
    throw new Error(`No se pudo verificar Auth: ${authError.message}`);
  }

  if (authData.users.length !== totals.employees) {
    throw new Error(
      `Verificación fallida en Auth: esperado=${totals.employees}, actual=${authData.users.length}`,
    );
  }

  return { ...actual, auth_users: authData.users.length };
}

async function removeCreatedUsers(adminClient, userIds) {
  for (const userId of userIds) {
    await adminClient.auth.admin.deleteUser(userId, false);
  }
}

async function main() {
  loadEnvironmentFile();
  const config = loadConfiguration();
  const adminClient = createAdminClient(config);
  const createdUserIds = [];

  writeOutput(`Proyecto confirmado: ${config.projectRef}`);
  writeOutput("Vaciando objetos de Storage...");
  const deletedObjects = await clearStorage(adminClient);
  writeOutput("Vaciando tablas public...");
  await runPublicDataReset(adminClient);
  writeOutput("Eliminando usuarios de Supabase Auth...");
  const deletedUsers = await deleteAllAuthUsers(adminClient);
  writeOutput("Generando datos iniciales...");

  try {
    const result = await seedData(adminClient, config, createdUserIds);
    const counts = await verifySeed(adminClient, result);

    writeOutput("Reset y seed completados.");
    writeOutput(
      JSON.stringify(
        {
          projectRef: config.projectRef,
          deletedObjects,
          deletedUsers,
          appointmentDateRange: {
            from: result.dates.at(0),
            to: result.dates.at(-1),
            openDays: result.dates.length,
            appointmentsPerDayAndClinic: APPOINTMENTS_PER_DAY,
          },
          counts,
          clinics: result.clinics.map((clinic) => ({
            clinicId: clinic.clinicId,
            clinicKey: clinic.clinicKey,
            clinicName: clinic.clinicName,
            credentials: [
              {
                email: clinic.admin.email,
                password: `Valor de SEED_${clinic.clinicKey === "dental" ? "DENTAL" : "AESTHETIC"}_ADMIN_PASSWORD o SEED_ADMIN_PASSWORD`,
                role: clinic.admin.role,
              },
              ...clinic.employees.map((employee) => ({
                email: employee.email,
                password: employee.password,
                role: employee.role,
              })),
            ],
          })),
        },
        null,
        2,
      ),
    );
  } catch (error) {
    console.error("La seed falló. Limpiando los datos parciales...");
    await runPublicDataReset(adminClient);
    await removeCreatedUsers(adminClient, createdUserIds);
    throw error;
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
