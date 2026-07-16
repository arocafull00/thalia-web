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

INSERT INTO public.employees (
  id,
  clinic_id,
  full_name,
  role,
  specialty,
  color,
  phone,
  active
)
VALUES (
  '00000000-0000-4000-8000-000000000001',
  '10000000-0000-4000-8000-000000000001',
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
  color,
  price
)
VALUES (
  '40000000-0000-4000-8000-000000000001',
  '10000000-0000-4000-8000-000000000001',
  'E2E Tratamiento Facial',
  'Facial',
  30,
  '#7c3aed',
  75.00
);

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
  treatment_id,
  price_at_booking
)
VALUES (
  '80000000-0000-4000-8000-000000000001',
  '70000000-0000-4000-8000-000000000001',
  '40000000-0000-4000-8000-000000000001',
  75.00
);
