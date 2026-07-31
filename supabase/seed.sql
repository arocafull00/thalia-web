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
  treatment_id,
  price_at_booking
)
VALUES
  (
    '80000000-0000-4000-8000-000000000010',
    '70000000-0000-4000-8000-000000000010',
    '40000000-0000-4000-8000-000000000001',
    75.00
  ),
  (
    '80000000-0000-4000-8000-000000000012',
    '70000000-0000-4000-8000-000000000012',
    '40000000-0000-4000-8000-000000000001',
    75.00
  );
