INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at,
  confirmation_token,
  email_change,
  email_change_token_new,
  recovery_token
)
VALUES (
  '00000000-0000-0000-0000-000000000000',
  '00000000-0000-4000-8000-000000000001',
  'authenticated',
  'authenticated',
  'e2e@landora.test',
  crypt('LandoraE2E123!', gen_salt('bf')),
  now(),
  '{"provider":"email","providers":["email"]}',
  '{"full_name":"E2E Administrador","registration_profile_complete":true,"intended_operational_role":"admin"}',
  now(),
  now(),
  '',
  '',
  '',
  ''
);

INSERT INTO auth.identities (
  id,
  provider_id,
  user_id,
  identity_data,
  provider,
  last_sign_in_at,
  created_at,
  updated_at
)
VALUES (
  '00000000-0000-4000-8000-000000000002',
  '00000000-0000-4000-8000-000000000001',
  '00000000-0000-4000-8000-000000000001',
  '{"sub":"00000000-0000-4000-8000-000000000001","email":"e2e@landora.test","email_verified":true}',
  'email',
  now(),
  now(),
  now()
);

INSERT INTO public.clinics (
  id,
  name,
  address,
  phone,
  owner_id,
  specialty
)
VALUES (
  '10000000-0000-4000-8000-000000000001',
  'Clínica E2E',
  'Calle de las Pruebas 73',
  '+34910000000',
  '00000000-0000-4000-8000-000000000001',
  'Medicina estética'
);

INSERT INTO public.clinic_billing (
  clinic_id,
  subscription_status,
  current_period_ends_at
)
VALUES (
  '10000000-0000-4000-8000-000000000001',
  'active',
  now() + interval '1 year'
)
ON CONFLICT (clinic_id) DO UPDATE
SET
  subscription_status = EXCLUDED.subscription_status,
  current_period_ends_at = EXCLUDED.current_period_ends_at;

INSERT INTO public.employees (
  id,
  account_type,
  full_name,
  role,
  specialty,
  color,
  phone,
  active
)
VALUES (
  '00000000-0000-4000-8000-000000000001',
  'internal',
  'E2E Administrador',
  'admin',
  'Medicina estética',
  '#2563eb',
  '+34600000000',
  true
);

INSERT INTO public.clinic_memberships (
  id,
  user_id,
  clinic_id,
  role,
  status,
  joined_at
)
VALUES (
  '20000000-0000-4000-8000-000000000001',
  '00000000-0000-4000-8000-000000000001',
  '10000000-0000-4000-8000-000000000001',
  'owner',
  'active',
  now()
);

INSERT INTO public.patients (
  id,
  clinic_id,
  full_name,
  dni,
  birth_date,
  phone,
  email,
  address,
  notes
)
VALUES
  (
    '30000000-0000-4000-8000-000000000001',
    '10000000-0000-4000-8000-000000000001',
    'E2E Paciente Base',
    '00000000T',
    '1990-01-15',
    '+34610000000',
    'paciente-base@landora.test',
    'Avenida de las Pruebas 1',
    'Paciente estable para las pruebas E2E.'
  ),
  (
    '30000000-0000-4000-8000-000000000002',
    '10000000-0000-4000-8000-000000000001',
    'E2E Paciente Filtro',
    '00000001R',
    '1988-05-20',
    '+34610000001',
    'paciente-filtro@landora.test',
    'Avenida de las Pruebas 2',
    'Paciente usado para validar búsqueda y filtros.'
  );

INSERT INTO public.treatment (
  id,
  clinic_id,
  name,
  category,
  duration_minutes,
  color
)
VALUES (
  '40000000-0000-4000-8000-000000000001',
  '10000000-0000-4000-8000-000000000001',
  'E2E Tratamiento Facial',
  'Facial',
  30,
  '#7c3aed'
);

INSERT INTO public.treatment_prices (treatment_id, price)
VALUES ('40000000-0000-4000-8000-000000000001', 75.00);

INSERT INTO public.inventory_items (
  id,
  clinic_id,
  name,
  category,
  unit,
  stock,
  min_stock,
  unit_price
)
VALUES (
  '50000000-0000-4000-8000-000000000001',
  '10000000-0000-4000-8000-000000000001',
  'E2E Material Facial',
  'Consumible',
  'unidad',
  100,
  10,
  2.50
);

INSERT INTO public.treatment_inventory_items (
  id,
  treatment_id,
  inventory_item_id,
  quantity
)
VALUES (
  '60000000-0000-4000-8000-000000000001',
  '40000000-0000-4000-8000-000000000001',
  '50000000-0000-4000-8000-000000000001',
  1
);

INSERT INTO public.appointments (
  id,
  clinic_id,
  patient_id,
  employee_id,
  starts_at,
  ends_at,
  status,
  notes
)
VALUES (
  '70000000-0000-4000-8000-000000000001',
  '10000000-0000-4000-8000-000000000001',
  '30000000-0000-4000-8000-000000000001',
  '00000000-0000-4000-8000-000000000001',
  date_trunc('day', now()) + interval '2 days 10 hours',
  date_trunc('day', now()) + interval '2 days 10 hours 30 minutes',
  'scheduled',
  'Cita base para las pruebas E2E.'
);

INSERT INTO public.appointment_treatments (
  id,
  appointment_id,
  treatment_id
)
VALUES (
  '80000000-0000-4000-8000-000000000001',
  '70000000-0000-4000-8000-000000000001',
  '40000000-0000-4000-8000-000000000001'
);

INSERT INTO public.appointment_treatment_prices (
  appointment_treatment_id,
  price_at_booking
)
VALUES ('80000000-0000-4000-8000-000000000001', 75.00);

-- ---------------------------------------------------------------------------
-- Datos de marketing (issue #31)
-- ---------------------------------------------------------------------------
-- Los pacientes base y de filtro se quedan con marketing_opt_in = false a
-- propósito: sirven de caso negativo. Estos cuatro cubren cada filtro de
-- campaign_segment_patients, incluidas las dos exclusiones obligatorias.

INSERT INTO public.patients (
  id,
  clinic_id,
  full_name,
  dni,
  birth_date,
  phone,
  email,
  notes,
  marketing_opt_in
)
VALUES
  -- Reciente y fiel: 2 visitas completadas, la última hace 1 mes.
  (
    '30000000-0000-4000-8000-000000000010',
    '10000000-0000-4000-8000-000000000001',
    'E2E Marketing Reciente',
    '10000010A',
    '1995-03-10',
    '+34610000010',
    'marketing-reciente@landora.test',
    'Opt-in, 2 visitas, la última hace 1 mes.',
    true
  ),
  -- Inactivo: 1 visita completada hace 8 meses. Objetivo de reactivación.
  (
    '30000000-0000-4000-8000-000000000011',
    '10000000-0000-4000-8000-000000000001',
    'E2E Marketing Inactivo',
    '10000011B',
    '1970-11-02',
    '+34610000011',
    'marketing-inactivo@landora.test',
    'Opt-in, 1 visita hace 8 meses.',
    true
  ),
  -- Opt-in pero SIN teléfono: debe quedar excluido siempre.
  (
    '30000000-0000-4000-8000-000000000012',
    '10000000-0000-4000-8000-000000000001',
    'E2E Marketing Sin Telefono',
    '10000012C',
    '1985-07-07',
    NULL,
    'marketing-sin-telefono@landora.test',
    'Opt-in pero sin teléfono: nunca debe recibir nada.',
    true
  ),
  -- Con teléfono y visitas, pero SIN consentimiento: excluido siempre.
  (
    '30000000-0000-4000-8000-000000000013',
    '10000000-0000-4000-8000-000000000001',
    'E2E Marketing Sin Consentimiento',
    '10000013D',
    '1992-02-20',
    '+34610000013',
    'marketing-sin-consentimiento@landora.test',
    'Sin opt-in: nunca debe recibir nada aunque cumpla el resto.',
    false
  );

INSERT INTO public.appointments (
  id,
  clinic_id,
  patient_id,
  employee_id,
  starts_at,
  ends_at,
  status,
  notes
)
VALUES
  (
    '70000000-0000-4000-8000-000000000010',
    '10000000-0000-4000-8000-000000000001',
    '30000000-0000-4000-8000-000000000010',
    '00000000-0000-4000-8000-000000000001',
    now() - interval '1 month',
    now() - interval '1 month' + interval '30 minutes',
    'completed',
    'Visita reciente completada.'
  ),
  (
    '70000000-0000-4000-8000-000000000011',
    '10000000-0000-4000-8000-000000000001',
    '30000000-0000-4000-8000-000000000010',
    '00000000-0000-4000-8000-000000000001',
    now() - interval '5 months',
    now() - interval '5 months' + interval '30 minutes',
    'completed',
    'Segunda visita completada.'
  ),
  (
    '70000000-0000-4000-8000-000000000012',
    '10000000-0000-4000-8000-000000000001',
    '30000000-0000-4000-8000-000000000011',
    '00000000-0000-4000-8000-000000000001',
    now() - interval '8 months',
    now() - interval '8 months' + interval '30 minutes',
    'completed',
    'Única visita, hace 8 meses.'
  ),
  (
    '70000000-0000-4000-8000-000000000013',
    '10000000-0000-4000-8000-000000000001',
    '30000000-0000-4000-8000-000000000013',
    '00000000-0000-4000-8000-000000000001',
    now() - interval '2 months',
    now() - interval '2 months' + interval '30 minutes',
    'completed',
    'Visita de un paciente sin consentimiento.'
  ),
  -- Cancelada: no debe contar como visita.
  (
    '70000000-0000-4000-8000-000000000014',
    '10000000-0000-4000-8000-000000000001',
    '30000000-0000-4000-8000-000000000011',
    '00000000-0000-4000-8000-000000000001',
    now() - interval '10 days',
    now() - interval '10 days' + interval '30 minutes',
    'cancelled',
    'Cancelada: no cuenta como visita.'
  );

INSERT INTO public.appointment_treatments (
  id,
  appointment_id,
  treatment_id
)
VALUES
  (
    '80000000-0000-4000-8000-000000000010',
    '70000000-0000-4000-8000-000000000010',
    '40000000-0000-4000-8000-000000000001'
  ),
  (
    '80000000-0000-4000-8000-000000000012',
    '70000000-0000-4000-8000-000000000012',
    '40000000-0000-4000-8000-000000000001'
  );

-- ---------------------------------------------------------------------------
-- Confirmación de cita por enlace público (issue #87)
-- ---------------------------------------------------------------------------
-- En producción estos tokens los crea `send-reminders` al incrustar el enlace
-- en el recordatorio. Aquí van sembrados con identificadores fijos para que el
-- E2E pueda visitar una URL concreta sin depender de la edge function. Van a +60 días a propósito: fuera del rango que pintan por
-- defecto el calendario y el listado de citas, así no alteran las asserciones
-- de los demás specs.

INSERT INTO public.appointments (
  id, clinic_id, patient_id, employee_id, starts_at, ends_at, status, notes
)
VALUES
  (
    '70000000-0000-4000-8000-000000000020',
    '10000000-0000-4000-8000-000000000001',
    '30000000-0000-4000-8000-000000000001',
    '00000000-0000-4000-8000-000000000001',
    date_trunc('day', now()) + interval '60 days 10 hours',
    date_trunc('day', now()) + interval '60 days 10 hours 30 minutes',
    'scheduled',
    'Cita confirmable por enlace público.'
  ),
  (
    '70000000-0000-4000-8000-000000000021',
    '10000000-0000-4000-8000-000000000001',
    '30000000-0000-4000-8000-000000000001',
    '00000000-0000-4000-8000-000000000001',
    date_trunc('day', now()) + interval '61 days 10 hours',
    date_trunc('day', now()) + interval '61 days 10 hours 30 minutes',
    'cancelled',
    'Cita cancelada: el enlace no debe ofrecer confirmar.'
  );

INSERT INTO public.appointment_confirmation_tokens (
  token, appointment_id, clinic_id, expires_at
)
VALUES
  (
    '90000000-0000-4000-8000-000000000001',
    '70000000-0000-4000-8000-000000000020',
    '10000000-0000-4000-8000-000000000001',
    now() + interval '67 days'
  ),
  (
    '90000000-0000-4000-8000-000000000002',
    '70000000-0000-4000-8000-000000000021',
    '10000000-0000-4000-8000-000000000001',
    now() + interval '68 days'
  ),
  -- Token caducado sobre una cita futura: comprueba el corte por caducidad
  -- independientemente del estado de la cita.
  (
    '90000000-0000-4000-8000-000000000003',
    '70000000-0000-4000-8000-000000000001',
    '10000000-0000-4000-8000-000000000001',
    now() - interval '1 day'
  );

-- ---------------------------------------------------------------------------
-- Profesional autónomo (issue #102)
-- ---------------------------------------------------------------------------
-- Membresía 'external' en la misma clínica, con rol de empleado 'doctor': es la
-- combinación que importa, porque la política de escritura de patients es FOR
-- ALL y en PostgreSQL eso concede también SELECT. Sin excluir a external de esa
-- política, un autónomo que fuese 'doctor' vería el censo entero.
--
-- Sólo se le da UNA cita, con el paciente base, así que es el único paciente que
-- debe ver. Va a +90 días para no aparecer en los rangos por defecto del
-- calendario ni del listado de citas y no alterar otros specs. No se añade
-- ningún paciente nuevo, para no tocar los recuentos de marketing.

-- `employees.id` es FK de `auth.users`, así que la cuenta va primero.
INSERT INTO auth.users (
  instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data, created_at, updated_at,
  confirmation_token, email_change, email_change_token_new, recovery_token
)
VALUES (
  '00000000-0000-0000-0000-000000000000',
  '00000000-0000-4000-8000-0000000000ff',
  'authenticated',
  'authenticated',
  'e2e-autonomo@landora.test',
  crypt('LandoraE2E123!', gen_salt('bf')),
  now(),
  '{"provider":"email","providers":["email"]}',
  '{"full_name":"E2E Autónomo","registration_profile_complete":true,"intended_operational_role":"doctor"}',
  now(), now(), '', '', '', ''
);

INSERT INTO auth.identities (
  id, provider_id, user_id, identity_data, provider,
  last_sign_in_at, created_at, updated_at
)
VALUES (
  '00000000-0000-4000-8000-0000000000fe',
  '00000000-0000-4000-8000-0000000000ff',
  '00000000-0000-4000-8000-0000000000ff',
  '{"sub":"00000000-0000-4000-8000-0000000000ff","email":"e2e-autonomo@landora.test","email_verified":true}',
  'email',
  now(), now(), now()
);

INSERT INTO public.employees (id, full_name, role, account_type, active)
VALUES (
  '00000000-0000-4000-8000-0000000000ff',
  'E2E Autónomo',
  'doctor',
  'external',
  true
);

INSERT INTO public.clinic_memberships (user_id, clinic_id, role, status)
VALUES (
  '00000000-0000-4000-8000-0000000000ff',
  '10000000-0000-4000-8000-000000000001',
  'external',
  'active'
);

INSERT INTO public.appointments (
  id, clinic_id, patient_id, employee_id, starts_at, ends_at, status, notes
)
VALUES (
  '70000000-0000-4000-8000-000000000030',
  '10000000-0000-4000-8000-000000000001',
  '30000000-0000-4000-8000-000000000001',
  '00000000-0000-4000-8000-0000000000ff',
  date_trunc('day', now()) + interval '90 days 9 hours',
  date_trunc('day', now()) + interval '90 days 9 hours 30 minutes',
  'scheduled',
  'Única cita del autónomo: define el paciente que puede ver.'
);
INSERT INTO public.appointment_treatment_prices (
  appointment_treatment_id,
  price_at_booking
)
VALUES
  ('80000000-0000-4000-8000-000000000010', 75.00),
  ('80000000-0000-4000-8000-000000000012', 75.00);
